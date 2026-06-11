package animations

import (
	"fmt"
	"strconv"
	"strings"
)

type dslTokenType int

const (
	dslTokenNumber dslTokenType = iota
	dslTokenIdentifier
	dslTokenOperator
	dslTokenParen
	dslTokenComma
	dslTokenEOF
)

type dslToken struct {
	kind  dslTokenType
	value string
}

type dslParser struct {
	tokens []dslToken
	index  int
}

func newDSLParser(input string) (*dslParser, error) {
	tokens, err := tokenizeDSL(input)
	if err != nil {
		return nil, err
	}
	return &dslParser{tokens: tokens}, nil
}

func (p *dslParser) parse() (dslExpr, error) {
	expr, err := p.expression(0)
	if err != nil {
		return nil, err
	}
	if p.peek().kind != dslTokenEOF {
		return nil, fmt.Errorf("Token inesperado: %s", p.peek().value)
	}
	return expr, nil
}

func (p *dslParser) expression(minPrecedence int) (dslExpr, error) {
	left, err := p.primary()
	if err != nil {
		return nil, err
	}
	for p.peek().kind == dslTokenOperator && dslPrecedence(p.peek().value) >= minPrecedence {
		operator := p.next().value
		right, err := p.expression(dslPrecedence(operator) + 1)
		if err != nil {
			return nil, err
		}
		left = dslBinary{op: operator, left: left, right: right}
	}
	return left, nil
}

func (p *dslParser) primary() (dslExpr, error) {
	token := p.next()
	switch token.kind {
	case dslTokenNumber:
		value, err := strconv.ParseFloat(token.value, 64)
		if err != nil {
			return nil, fmt.Errorf("Numero DSL no valido: %s", token.value)
		}
		return dslNumber{value: value}, nil
	case dslTokenOperator:
		if token.value == "-" {
			value, err := p.primary()
			if err != nil {
				return nil, err
			}
			return dslUnary{value: value}, nil
		}
	case dslTokenIdentifier:
		if p.peek().kind == dslTokenParen && p.peek().value == "(" {
			p.next()
			args := []dslExpr{}
			for !(p.peek().kind == dslTokenParen && p.peek().value == ")") {
				arg, err := p.expression(0)
				if err != nil {
					return nil, err
				}
				args = append(args, arg)
				if p.peek().kind == dslTokenComma {
					p.next()
					continue
				}
				break
			}
			if !(p.peek().kind == dslTokenParen && p.peek().value == ")") {
				return nil, fmt.Errorf("Falta cerrar llamada %s(...).", token.value)
			}
			p.next()
			return dslCall{name: token.value, args: args}, nil
		}
		return dslVariable{name: token.value}, nil
	case dslTokenParen:
		if token.value == "(" {
			expr, err := p.expression(0)
			if err != nil {
				return nil, err
			}
			if !(p.peek().kind == dslTokenParen && p.peek().value == ")") {
				return nil, fmt.Errorf("Falta cerrar parentesis.")
			}
			p.next()
			return expr, nil
		}
	}
	if token.value != "" {
		return nil, fmt.Errorf("Token inesperado: %s", token.value)
	}
	return nil, fmt.Errorf("Token inesperado")
}

func (p *dslParser) peek() dslToken {
	if p.index >= len(p.tokens) {
		return dslToken{kind: dslTokenEOF}
	}
	return p.tokens[p.index]
}

func (p *dslParser) next() dslToken {
	token := p.peek()
	p.index++
	return token
}

func tokenizeDSL(input string) ([]dslToken, error) {
	tokens := []dslToken{}
	for index := 0; index < len(input); {
		char := input[index]
		if char == ' ' || char == '\t' || char == '\r' || char == '\n' {
			index++
			continue
		}
		if isNumberStart(input, index) {
			start := index
			if input[index] == '.' {
				index++
			}
			for index < len(input) && input[index] >= '0' && input[index] <= '9' {
				index++
			}
			if index < len(input) && input[index] == '.' {
				index++
				for index < len(input) && input[index] >= '0' && input[index] <= '9' {
					index++
				}
			}
			if index < len(input) && (input[index] == 'e' || input[index] == 'E') {
				exp := index + 1
				if exp < len(input) && (input[exp] == '+' || input[exp] == '-') {
					exp++
				}
				digits := exp
				for exp < len(input) && input[exp] >= '0' && input[exp] <= '9' {
					exp++
				}
				if exp > digits {
					index = exp
				}
			}
			tokens = append(tokens, dslToken{kind: dslTokenNumber, value: input[start:index]})
			continue
		}
		r := rune(char)
		if isIdentifierStart(r) {
			start := index
			index++
			for index < len(input) && isIdentifierPart(rune(input[index])) {
				index++
			}
			tokens = append(tokens, dslToken{kind: dslTokenIdentifier, value: input[start:index]})
			continue
		}
		switch {
		case strings.ContainsRune("+-*/%", rune(char)):
			tokens = append(tokens, dslToken{kind: dslTokenOperator, value: string(char)})
		case char == '(' || char == ')':
			tokens = append(tokens, dslToken{kind: dslTokenParen, value: string(char)})
		case char == ',':
			tokens = append(tokens, dslToken{kind: dslTokenComma, value: string(char)})
		default:
			return nil, fmt.Errorf("Token DSL no valido: %c", char)
		}
		index++
	}
	tokens = append(tokens, dslToken{kind: dslTokenEOF})
	return tokens, nil
}

func isNumberStart(input string, index int) bool {
	char := input[index]
	if char >= '0' && char <= '9' {
		return true
	}
	return char == '.' && index+1 < len(input) && input[index+1] >= '0' && input[index+1] <= '9'
}

func dslPrecedence(operator string) int {
	if operator == "+" || operator == "-" {
		return 1
	}
	return 2
}
