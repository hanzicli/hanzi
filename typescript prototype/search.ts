package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// Function to load the CSV file into a slice of strings
func loadDatabase(filePath string) ([]string, error) {
	// Open the CSV file
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Create a slice to hold the file's content
	var csvData []string
	scanner := bufio.NewScanner(file)

	// Read the file line by line
	for scanner.Scan() {
		csvData = append(csvData, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return csvData, nil
}

// Function to search for the character in the CSV data
func searchCharacterInFile(character, filePath string) {
	// Load CSV data
	csvData, err := loadDatabase(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}

	// Search for the character
	found := false
	for _, row := range csvData {
		// Split the row by commas
		columns := strings.Split(row, ",")
		if len(columns) >= 8 && strings.TrimSpace(columns[0]) == character {
			// Print the character data with color directly in the fmt.Printf statements
			fmt.Printf("\n\x1b[1mCharacter Found!\x1b[0m\n")
			fmt.Printf("\x1b[36m-------------------------------\x1b[0m\n")
			fmt.Printf("\x1b[35mCharacter: \x1b[1m%s\x1b[0m\n", columns[0])
			fmt.Printf("\x1b[32mPinyin: \x1b[1m%s\x1b[0m\n", columns[1])
			fmt.Printf("\x1b[33mDefinition: \x1b[1m%s\x1b[0m\n", columns[2])
			fmt.Printf("\x1b[36mRadical: \x1b[1m%s\x1b[0m\n", columns[3])
			fmt.Printf("\x1b[32mRadical Code: \x1b[1m%s\x1b[0m\n", columns[4])
			fmt.Printf("\x1b[33mStrokes: \x1b[1m%s\x1b[0m\n", columns[5])
			fmt.Printf("\x1b[36mHSK Level: \x1b[1m%s\x1b[0m\n", columns[6])
			fmt.Printf("\x1b[32mGeneral Standard Num: \x1b[1m%s\x1b[0m\n", columns[7])
			fmt.Printf("\x1b[36m-------------------------------\x1b[0m\n")
			found = true
			break
		}
	}

	if !found {
		fmt.Printf("\x1b[31mCharacter \"%s\" not found.\x1b[0m\n", character)
	}
}

func main() {
	// Read the character to search from command-line argument
	if len(os.Args) < 2 {
		fmt.Println("Please provide a Chinese character to search for.")
		return
	}

	characterToSearch := os.Args[1]
	filePath := "hanzi.csv.db"

	searchCharacterInFile(characterToSearch, filePath)
}
