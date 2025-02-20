# Define the output binary name and source file
BINARY_NAME = hanzicli
SOURCE_FILE = cli.go

# Default target: Build the binary
all: build

# Build command
build:
	go build -o $(BINARY_NAME) $(SOURCE_FILE)

# Clean command: Remove the compiled binary
clean:
	rm -f $(BINARY_NAME)

# Run the binary after building
run: build
	./$(BINARY_NAME)

.PHONY: all build clean run
