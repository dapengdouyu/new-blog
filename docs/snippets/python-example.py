def calculate_fibonacci(n: int) -> list[int]:
    """Calculate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []

    sequence = [0, 1]
    if n == 1:
        return [0]
    elif n == 2:
        return sequence

    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])

    return sequence

# Example usage
if __name__ == "__main__":
    fib_sequence = calculate_fibonacci(10)
    print(f"Fibonacci sequence: {fib_sequence}")
