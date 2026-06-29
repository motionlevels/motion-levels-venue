#include <camera/camera.h>
#include <camera/device_discovery.h>
#include <camera/photography_settings.h>

#include <algorithm>
#include <cctype>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <filesystem>
#include <iostream>
#include <memory>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

namespace {

void fail(const std::string& message, int code = 1);

std::string env_string(const char* name, const std::string& fallback = "") {
    const char* value = std::getenv(name);
    if (value == nullptr || std::string(value).empty()) return fallback;
    return value;
}

bool env_bool(const char* name, bool fallback) {
    std::string value = env_string(name);
    std::transform(value.begin(), value.end(), value.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    if (value.empty()) return fallback;
    return value == "1" || value == "true" || value == "yes" || value == "on";
}

int env_int(const char* name, int fallback) {
    std::string value = env_string(name);
    if (value.empty()) return fallback;
    try {
        return std::stoi(value);
    } catch (...) {
        return fallback;
    }
}

std::string lowercase(std::string value) {
    std::transform(value.begin(), value.end(), value.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return value;
}

ins_camera::VideoResolution env_video_resolution(const char* name, ins_camera::VideoResolution fallback) {
    std::string value = lowercase(env_string(name));
    if (value.empty()) return fallback;
    value.erase(std::remove(value.begin(), value.end(), '_'), value.end());
    value.erase(std::remove(value.begin(), value.end(), '-'), value.end());
    if (value == "1080" || value == "1080p" || value == "1080p30" || value == "19201080p30") return ins_camera::VideoResolution::RES_1920_1080P30;
    if (value == "2k30" || value == "2kp30" || value == "1920960p30") return ins_camera::VideoResolution::RES_1920_960P30;
    if (value == "4k30" || value == "4kp30" || value == "38401920p30") return ins_camera::VideoResolution::RES_4KP30;
    if (value == "4k25" || value == "4kp25" || value == "38401920p25") return ins_camera::VideoResolution::RES_4KP25;
    if (value == "4k24" || value == "4kp24" || value == "38401920p24") return ins_camera::VideoResolution::RES_4KP24;
    if (value == "57k30" || value == "57kp30" || value == "5.7k30" || value == "5.7kp30") return ins_camera::VideoResolution::RES_57KP30;
    if (value == "57k25" || value == "57kp25" || value == "5.7k25" || value == "5.7kp25") return ins_camera::VideoResolution::RES_57KP25;
    if (value == "57k24" || value == "57kp24" || value == "5.7k24" || value == "5.7kp24") return ins_camera::VideoResolution::RES_57KP24;
    try {
        return static_cast<ins_camera::VideoResolution>(std::stoi(value));
    } catch (...) {
        fail("unsupported video resolution: " + value);
    }
    return fallback;
}

std::string json_escape(const std::string& value) {
    std::ostringstream out;
    for (char c : value) {
        switch (c) {
            case '"': out << "\\\""; break;
            case '\\': out << "\\\\"; break;
            case '\b': out << "\\b"; break;
            case '\f': out << "\\f"; break;
            case '\n': out << "\\n"; break;
            case '\r': out << "\\r"; break;
            case '\t': out << "\\t"; break;
            default:
                if (static_cast<unsigned char>(c) < 0x20) {
                    out << "\\u00";
                    const char* hex = "0123456789abcdef";
                    out << hex[(c >> 4) & 0x0f] << hex[c & 0x0f];
                } else {
                    out << c;
                }
        }
    }
    return out.str();
}

std::string json_array(const std::vector<std::string>& values) {
    std::ostringstream out;
    out << "[";
    for (size_t i = 0; i < values.size(); ++i) {
        if (i > 0) out << ",";
        out << "\"" << json_escape(values[i]) << "\"";
    }
    out << "]";
    return out.str();
}

void fail(const std::string& message, int code) {
    std::cout << "{\"ok\":false,\"error\":\"" << json_escape(message) << "\"}" << std::endl;
    std::exit(code);
}

std::string remote_extension(const std::string& url, const std::string& fallback) {
    auto slash = url.find_last_of("/\\");
    std::string name = slash == std::string::npos ? url : url.substr(slash + 1);
    auto dot = name.find_last_of('.');
    if (dot == std::string::npos) return fallback;
    std::string ext = name.substr(dot);
    if (ext.size() > 12) return fallback;
    return ext;
}

std::vector<std::string> download_urls(const std::shared_ptr<ins_camera::Camera>& camera, const std::vector<std::string>& urls, const fs::path& target) {
    std::vector<std::string> local_paths;
    if (urls.empty()) return local_paths;
    fs::create_directories(target.parent_path());
    for (size_t i = 0; i < urls.size(); ++i) {
        fs::path local = target;
        if (i > 0) {
            local = target.parent_path() / (target.stem().string() + ".part" + std::to_string(i + 1) + remote_extension(urls[i], target.extension().string()));
        }
        std::cerr << "downloading " << urls[i] << " -> " << local << std::endl;
        bool ok = camera->DownloadCameraFile(urls[i], local.string(), [](int64_t current, int64_t total) {
            if (total > 0 && current == total) std::cerr << "download complete bytes=" << current << std::endl;
        });
        if (!ok) fail("failed to download camera file: " + urls[i]);
        if (env_bool("MOTION_LEVELS_INSTA360_DELETE_AFTER_DOWNLOAD", true)) {
            if (camera->DeleteCameraFile(urls[i])) {
                std::cerr << "deleted camera file " << urls[i] << std::endl;
            } else {
                std::cerr << "warning: failed to delete camera file " << urls[i] << std::endl;
            }
        }
        local_paths.push_back(local.string());
    }
    return local_paths;
}

std::shared_ptr<ins_camera::Camera> open_camera(ins_camera::DeviceDescriptor& selected) {
    ins_camera::SetLogLevel(ins_camera::LogLevel::ERR);
    std::string log_path = env_string("MOTION_LEVELS_INSTA360_LOG_PATH");
    if (!log_path.empty()) ins_camera::SetLogPath(log_path);

    ins_camera::DeviceDiscovery discovery;
    auto devices = discovery.GetAvailableDevices();
    if (devices.empty()) fail("no Insta360 camera found");

    std::string requested_serial = env_string("MOTION_LEVELS_INSTA360_SERIAL");
    int selected_index = -1;
    for (size_t i = 0; i < devices.size(); ++i) {
        if (requested_serial.empty() || devices[i].serial_number == requested_serial) {
            selected_index = static_cast<int>(i);
            break;
        }
    }
    if (selected_index < 0) fail("requested Insta360 serial was not found: " + requested_serial);

    selected = devices[static_cast<size_t>(selected_index)];
    auto camera = std::make_shared<ins_camera::Camera>(selected.info);
    camera->SetTimeout(env_int("MOTION_LEVELS_INSTA360_TIMEOUT_MS", 20000));
    camera->SetServicePort(env_int("MOTION_LEVELS_INSTA360_SERVICE_PORT", 9099));
    if (!camera->Open()) fail("failed to open Insta360 camera");

    const auto now = std::time(nullptr);
    std::tm tm{};
    localtime_r(&now, &tm);
    const auto local_as_utc = timegm(&tm);
    camera->SyncLocalTimeToCamera(static_cast<uint64_t>(now), static_cast<uint32_t>(local_as_utc - now));
    discovery.FreeDeviceDescriptors(devices);
    return camera;
}

bool maybe_enable_stitching(const std::shared_ptr<ins_camera::Camera>& camera) {
    if (!env_bool("MOTION_LEVELS_INSTA360_ENABLE_STITCHING", true)) return false;
    if (!camera->EnableInCameraStitching(true)) {
        std::cerr << "warning: failed to enable in-camera stitching" << std::endl;
        return false;
    }
    return true;
}

void run_status(const std::shared_ptr<ins_camera::Camera>& camera, const ins_camera::DeviceDescriptor& device) {
    ins_camera::BatteryStatus battery{};
    ins_camera::StorageStatus storage{};
    bool battery_ok = camera->GetBatteryStatus(battery);
    bool storage_ok = camera->GetStorageState(storage);
    std::cout
        << "{\"ok\":true"
        << ",\"serial\":\"" << json_escape(device.serial_number) << "\""
        << ",\"cameraName\":\"" << json_escape(device.camera_name) << "\""
        << ",\"firmware\":\"" << json_escape(device.fw_version) << "\""
        << ",\"batteryOk\":" << (battery_ok ? "true" : "false")
        << ",\"batteryLevel\":" << (battery_ok ? std::to_string(battery.battery_level) : "null")
        << ",\"storageOk\":" << (storage_ok ? "true" : "false")
        << ",\"storageState\":" << (storage_ok ? std::to_string(storage.state) : "null")
        << ",\"storageFree\":" << (storage_ok ? std::to_string(storage.free_space) : "null")
        << ",\"storageTotal\":" << (storage_ok ? std::to_string(storage.total_space) : "null")
        << "}" << std::endl;
}

void run_start(const std::shared_ptr<ins_camera::Camera>& camera, const ins_camera::DeviceDescriptor&) {
    bool stitching_enabled = maybe_enable_stitching(camera);
    std::string video_mode = lowercase(env_string("MOTION_LEVELS_INSTA360_VIDEO_MODE", "normal"));
    ins_camera::SubVideoMode sub_mode = ins_camera::SubVideoMode::VIDEO_NORMAL;
    ins_camera::CameraFunctionMode function_mode = ins_camera::CameraFunctionMode::FUNCTION_MODE_NORMAL_VIDEO;
    if (video_mode == "hdr") {
        sub_mode = ins_camera::SubVideoMode::VIDEO_HDR;
        function_mode = ins_camera::CameraFunctionMode::FUNCTION_MODE_HDR_VIDEO;
    } else if (video_mode != "normal") {
        fail("unsupported video mode: " + video_mode);
    }
    if (!camera->SetVideoSubMode(sub_mode)) {
        fail("failed to set " + video_mode + " video submode");
    }
    if (video_mode == "hdr" || env_bool("MOTION_LEVELS_INSTA360_SET_VIDEO_PARAMS", false)) {
        ins_camera::RecordParams params;
        params.resolution = env_video_resolution("MOTION_LEVELS_INSTA360_VIDEO_RESOLUTION", ins_camera::VideoResolution::RES_4KP30);
        params.bitrate = env_int("MOTION_LEVELS_INSTA360_VIDEO_BITRATE", 0);
        if (!camera->SetVideoCaptureParams(params, function_mode)) {
            fail("failed to set video capture params");
        }
    }
    if (!camera->StartRecording()) fail("failed to start recording");
    std::cout
        << "{\"ok\":true,\"recording\":true"
        << ",\"videoMode\":\"" << json_escape(video_mode) << "\""
        << ",\"stitchingEnabled\":" << (stitching_enabled ? "true" : "false")
        << "}" << std::endl;
}

void run_stop(const std::shared_ptr<ins_camera::Camera>& camera, const ins_camera::DeviceDescriptor&) {
    auto url = camera->StopRecording();
    if (url.Empty()) fail("stop recording returned no media URL");
    auto origins = url.OriginUrls();
    std::vector<std::string> local_paths;
    std::string target = env_string("MOTION_LEVELS_CAMERA_MEDIA_PATH");
    if (!target.empty() && env_bool("MOTION_LEVELS_INSTA360_DOWNLOAD", true)) {
        local_paths = download_urls(camera, origins, fs::path(target));
    }
    std::cout << "{\"ok\":true,\"remoteUrls\":" << json_array(origins) << ",\"localPaths\":" << json_array(local_paths) << "}" << std::endl;
}

void run_photo(const std::shared_ptr<ins_camera::Camera>& camera, const ins_camera::DeviceDescriptor&) {
    maybe_enable_stitching(camera);
    if (!camera->SetPhotoSubMode(ins_camera::SubPhotoMode::PHOTO_SINGLE)) {
        std::cerr << "warning: failed to set single photo submode" << std::endl;
    }
    std::string photo_size = env_string("MOTION_LEVELS_INSTA360_PHOTO_SIZE");
    if (!photo_size.empty()) {
        ins_camera::PhotoSize size = ins_camera::PhotoSize::Size_72M;
        if (photo_size == "18M" || photo_size == "x4-18m") size = ins_camera::PhotoSize::Size_X4_18MP;
        if (!camera->SetPhotoSize(ins_camera::CameraFunctionMode::FUNCTION_MODE_NORMAL_IMAGE, size)) {
            fail("failed to set photo size");
        }
    }
    auto url = camera->TakePhoto();
    if (url.Empty()) fail("take photo returned no media URL");
    auto origins = url.OriginUrls();
    std::vector<std::string> local_paths;
    std::string target = env_string("MOTION_LEVELS_CAMERA_MEDIA_PATH");
    if (!target.empty() && env_bool("MOTION_LEVELS_INSTA360_DOWNLOAD", true)) {
        local_paths = download_urls(camera, origins, fs::path(target));
    }
    std::cout << "{\"ok\":true,\"remoteUrls\":" << json_array(origins) << ",\"localPaths\":" << json_array(local_paths) << "}" << std::endl;
}

}  // namespace

int main(int argc, char** argv) {
    if (argc < 2) {
        fail("usage: motion-levels-insta360 <status|start|stop|photo>", 64);
    }
    std::string command = argv[1];
    ins_camera::DeviceDescriptor selected;
    auto camera = open_camera(selected);
    try {
        if (command == "status") run_status(camera, selected);
        else if (command == "start") run_start(camera, selected);
        else if (command == "stop") run_stop(camera, selected);
        else if (command == "photo") run_photo(camera, selected);
        else fail("unknown command: " + command, 64);
    } catch (const std::exception& exc) {
        camera->Close();
        fail(exc.what());
    }
    camera->Close();
    return 0;
}
