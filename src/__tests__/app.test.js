import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import App from "../App.tsx";

afterEach(() => {
  cleanup();
});

test("expect starting board is clear", () => {
  render(<App />);
  expect(screen.getByTestId("cell-0,0")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-0,1")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-0,2")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-1,0")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-1,1")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,2")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,0")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,1")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,2")).not.toHaveTextContent();
});

test("expect O goes first", () => {
  render(<App />);
  const playerWindow = screen.getByTestId("pw");
  expect(playerWindow).toHaveTextContent("O's turn");
});

test("expect O takes the first cell and X goes next", () => {
  render(<App />);
  const r = Math.floor(Math.random() * 3);
  const c = Math.floor(Math.random() * 3);
  const cell = screen.getByTestId(`cell-${r},${c}`);
  fireEvent.click(cell);
  expect(cell).toHaveTextContent("O")
  const playerWindow = screen.getByTestId("pw");
  expect(playerWindow).toHaveTextContent("X's turn");
});

test("expect O wins on diagonal", () => {
  render(<App />);
  fireEvent.click(screen.getByTestId("cell-0,0")); // O
  fireEvent.click(screen.getByTestId("cell-0,1")); // X
  fireEvent.click(screen.getByTestId("cell-1,1")); // O
  fireEvent.click(screen.getByTestId("cell-0,2")); // X
  fireEvent.click(screen.getByTestId("cell-2,2")); // O
  const playerWindow = screen.getByTestId("pw");
  expect(playerWindow).toHaveTextContent("O wins!");
});

test("expect X wins on antidiagonal", () => {
  render(<App />);
  fireEvent.click(screen.getByTestId("cell-0,0")); // O
  fireEvent.click(screen.getByTestId("cell-0,2")); // X
  fireEvent.click(screen.getByTestId("cell-1,2")); // O
  fireEvent.click(screen.getByTestId("cell-1,1")); // X
  fireEvent.click(screen.getByTestId("cell-2,2")); // O
  fireEvent.click(screen.getByTestId("cell-2,0")); // X
  const playerWindow = screen.getByTestId("pw");
  expect(playerWindow).toHaveTextContent("X wins!");
});

test("expect empty cell is disabled after win", () => {
  render(<App />); 
  // O wins
  fireEvent.click(screen.getByTestId("cell-0,0"));
  fireEvent.click(screen.getByTestId("cell-0,1"));
  fireEvent.click(screen.getByTestId("cell-1,1"));
  fireEvent.click(screen.getByTestId("cell-0,2"));
  fireEvent.click(screen.getByTestId("cell-2,2"));
  const unselectedCell = screen.getByTestId("cell-1,2");
  fireEvent.click(unselectedCell);
  expect(unselectedCell).not.toHaveTextContent();
});

test("expect double click not to change values", () => {
  render(<App />);
  const r = Math.floor(Math.random() * 3);
  const c = Math.floor(Math.random() * 3);
  const r2 = Math.floor(Math.random() * 3);
  const c2 = Math.floor(Math.random() * 3);
  const cell1 = screen.getByTestId(`cell-${r},${c}`);
  const cell2 = screen.getByTestId(`cell-${r2},${c2}`);
  fireEvent.click(cell1);
  const cell1TextAfterFirstClick = cell1.textContent;
  fireEvent.click(cell1);
  expect(cell1).toHaveTextContent(cell1TextAfterFirstClick);
  fireEvent.click(cell2);
  const cell2TextAfterFirstClick = cell2.textContent;
  fireEvent.click(cell2);
  expect(cell2).toHaveTextContent(cell2TextAfterFirstClick);
});

test("expect reset clears the board and resets the player", () => {
  render(<App />);
  //play the game to a draw
  fireEvent.click(screen.getByTestId("cell-0,0"));
  fireEvent.click(screen.getByTestId("cell-0,1"));
  fireEvent.click(screen.getByTestId("cell-0,2"));
  fireEvent.click(screen.getByTestId("cell-1,1"));
  fireEvent.click(screen.getByTestId("cell-1,0"));
  fireEvent.click(screen.getByTestId("cell-2,0"));
  fireEvent.click(screen.getByTestId("cell-1,2"));
  fireEvent.click(screen.getByTestId("cell-2,2"));
  fireEvent.click(screen.getByTestId("cell-2,1"));
  const playerWindow = screen.getByTestId("pw");
  //make sure x goes next
  expect(playerWindow).toHaveTextContent("X's turn");
  const reset = screen.getByTestId("reset");
  fireEvent.click(reset);
  expect(playerWindow).toHaveTextContent("O's turn");
  expect(screen.getByTestId("cell-0,0")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-0,1")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-0,2")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-1,0")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-1,1")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-1,2")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,0")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,1")).not.toHaveTextContent();
  expect(screen.getByTestId("cell-2,2")).not.toHaveTextContent();
});
