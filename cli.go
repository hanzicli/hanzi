package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// Function to load the CSV file into a slice of strings
func loadDatabase(filePath string) ([]string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var csvData []string
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		csvData = append(csvData, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return csvData, nil
}

// Function to search for the character or pinyin in the CSV data
func searchCharacterOrPinyin(query, filePath string, raw, jsonOutput bool) {
	csvData, err := loadDatabase(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}

	found := false
	for _, row := range csvData {
		columns := strings.Split(row, ",")
		if len(columns) < 8 {
			continue
		}

		character := strings.TrimSpace(columns[0])
		pinyin := strings.TrimSpace(columns[1])

		// Check if the input matches either the character or the Pinyin
		if character == query || pinyin == query {
			found = true

			if raw {
				fmt.Println(row)
				return
			}

			if jsonOutput {
				jsonData := map[string]string{
					"Character":          character,
					"Pinyin":             pinyin,
					"Definition":         columns[2],
					"Radical":            columns[3],
					"Strokes":            columns[5],
					"HSK_Level":          columns[6],
					"General_Standard":   columns[7],
				}
				jsonBytes, _ := json.MarshalIndent(jsonData, "", "  ")
				fmt.Println(string(jsonBytes))
				return
			}

			// Default formatted output
			fmt.Printf("\n\x1b[1mCharacter Found!\x1b[0m\n")
			fmt.Printf("\x1b[36m-------------------------------\x1b[0m\n")
			fmt.Printf("\x1b[35mCharacter: \x1b[1m%s\x1b[0m\n", character)
			fmt.Printf("\x1b[32mPinyin: \x1b[1m%s\x1b[0m\n", pinyin)
			fmt.Printf("\x1b[33mDefinition: \x1b[1m%s\x1b[0m\n", columns[2])
			fmt.Printf("\x1b[36mRadical: \x1b[1m%s\x1b[0m\n", columns[3])
			fmt.Printf("\x1b[33mStrokes: \x1b[1m%s\x1b[0m\n", columns[5])
			fmt.Printf("\x1b[36mHSK Level: \x1b[1m%s\x1b[0m\n", columns[6])
			fmt.Printf("\x1b[32mGeneral Standard Num: \x1b[1m%s\x1b[0m\n", columns[7])
			fmt.Printf("\x1b[36m-------------------------------\x1b[0m\n")
			return
		}
	}

	if !found {
		fmt.Printf("\x1b[31mEntry \"%s\" not found.\x1b[0m\n", query)
	}
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: hanzi_search [character|pinyin] [--raw | --json]")
		return
	}

	query := os.Args[1]
	raw := false
	jsonOutput := false

	// Check for flags
	for _, arg := range os.Args[2:] {
		if arg == "--raw" {
			raw = true
		} else if arg == "--json" {
			jsonOutput = true
		}
	}

	filePath := "hanzi.csv.db"
	searchCharacterOrPinyin(query, filePath, raw, jsonOutput)
}
