from itertools import product
from typing import List, Tuple, Set, Dict, Optional
from random import choice, randint
from enum import Enum
import copy


class Directions(Enum):
    HORIZONTAL = 1
    VERTICAL = 2
    DIAGONAL = 3


class PuzzleGrid:
    def __init__(
        self, grid_size: Tuple[int, int], search_words: List[str], max_word_length: int
    ):
        self.grid_size: Tuple[int, int] = grid_size
        self.max_word_length = max_word_length
        rows_idx = cols_idx = list(range(0, self.grid_size[0]))
        self.possible_positions: Set[Tuple[int, int]] = set(product(rows_idx, cols_idx))
        self.grid: List[List[str]] = self._create_grid(grid_size=self.grid_size)
        self.words: List[str] = [
            word[0] for word in search_words if len(word[0]) <= max_word_length
        ]
        self.search_words = search_words
        self.tried_directions: List[Directions] = list()
        self.invalid_positions: Set[Tuple[int, int]] = set()
        self.tried_positions: Set[Tuple[int, int]] = set()
        self.word_pos = (
            []
            )       
        self.answers: Dict[
            str, List[Tuple[int, int]]
        ] = {}

    def _create_grid(self, grid_size: Tuple[int, int]) -> List[List[str]]:
        return [["#" for _ in range(grid_size[1])] for _ in range(grid_size[0])]

    def place_words(self) -> None:
        assert (
            max([len(word) for word in self.search_words]) <= self.grid_size[0]
        ), "There are search words longer than grid size. Please generate shorter search words."

        for word in self.words:
            if len(word) > self.max_word_length:
                self.words.remove(word)
            rem_pos = self.possible_positions.difference(self.invalid_positions)
            self.tried_positions = set()
            grid = self.grid.copy()
            self.tried_directions = []
            fit = self._gen_valid_pos_and_make_grid(word, rem_pos)
            if fit is None or not fit:
                self.words.remove(word)

            if fit:
                self.answers[word] = self.word_pos
                self.word_pos = []

        self._fill_grid()

        self.search_words = [
            word for word in self.search_words if word[0] in self.answers.keys()
        ]

    def _gen_valid_pos_and_make_grid(
        self,
        word: str,
        rem_positions: Set[Tuple[int, int]],
    ) -> Optional[bool]:

        while True:
            if len(self.tried_positions) == len(self.possible_positions):
                return False
            self.tried_directions = []
            valid_start_pos = self._get_start_pos(rem_positions)
            direction = self._get_direction()

            if valid_start_pos is None:
                return None

            valid_pos = self._check_if_valid_start_pos(
                search_word=word, starting_position=valid_start_pos
            )

            if valid_pos:
                valid_grid = self._try_make_valid_grid(word, valid_start_pos, direction)
                if valid_grid is None:
                    continue
                else:
                    return True
            else:
                continue

    def _get_start_pos(self, rem_pos) -> Optional[Tuple[int, int]]:
        while True:
            if len(self.invalid_positions) == len(self.possible_positions):
                return None
            pos_list = list(rem_pos.difference(self.tried_positions))

            try:
                start_pos = choice(pos_list)
            except IndexError:
                return None
            if start_pos in self.invalid_positions:
                continue
            if start_pos not in self.tried_positions:
                self.tried_positions.add(start_pos)
                break

        return start_pos

    def _get_direction(self) -> Directions:
        while True:
            direction = Directions(randint(1, 3))
            if direction not in self.tried_directions:
                self.tried_directions.append(direction)
                break

        return direction

    def _put_letters(
        self,
        word: str,
        starting_position: Tuple[int, int],
        grid: List[List[str]],
        arrangement: Directions,
    ) -> Optional[List[List[str]]]:
        row, col = starting_position
        used_positions = []
        grid = copy.deepcopy(grid)

        if arrangement is Directions.HORIZONTAL:
            for letter in word:
                if row > self.grid_size[0] - 1 or col > self.grid_size[1] - 1:
                    return None
                if grid[row][col] == "#":
                    grid[row][col] = letter.capitalize()
                    used_positions.append((row, col))
                    self.word_pos.append((row, col))
                    col += 1
                elif grid[row][col] == letter:
                    col += 1
                    continue
                else:
                    return None
        if arrangement is Directions.VERTICAL:
            for letter in word:
                if row > self.grid_size[0] - 1 or col > self.grid_size[1] - 1:
                    return None
                if grid[row][col] == "#":
                    grid[row][col] = letter.capitalize()
                    used_positions.append((row, col))
                    self.word_pos.append((row, col))
                    row += 1
                elif grid[row][col] == letter:
                    row += 1
                    continue
                else:
                    return None
        if arrangement is Directions.DIAGONAL:
            for letter in word:
                if row > self.grid_size[0] - 1 or col > self.grid_size[1] - 1:
                    return None
                if grid[row][col] == "#":
                    grid[row][col] = letter.capitalize()
                    used_positions.append((row, col))
                    self.word_pos.append((row, col))
                    row += 1
                    col += 1
                elif grid[row][col] == letter:
                    row += 1
                    col += 1
                    continue
                else:
                    return None

        # HERE IN CASE BACKWARD ARRANGEMENT WILL BE SUPPORTED LATER

        # if arrangement is Directions.BACKWARD:
        #     for letter in word:
        #         if grid[row][col] == '#':
        #             grid[row][col] = letter
        #             used_positions.append((row, col))
        #             col -= 1
        #         else:
        #             return None

        self.invalid_positions.update(set(used_positions))

        return grid

    def _check_if_valid_start_pos(
        self,
        search_word: str,
        starting_position: Tuple[int, int],
    ) -> bool:
        word_length = len(search_word)
        row, col = starting_position
        total_rows, total_cols = self.grid_size
        num_avail_cols = total_cols - col
        num_avail_rows = total_rows - row

        return (
            num_avail_cols > word_length
            or num_avail_rows > word_length
            or (num_avail_cols > word_length and num_avail_rows > word_length)
        )

        # if arrangement is Directions.HORIZONTAL:
        #     return num_avail_cols > word_length or num_avail_rows > word_length or (num_avail_cols > word_length and num_avail_rows > word_length)
        # if arrangement is Directions.VERTICAL:
        #     return
        # if arrangement is Directions.DIAGONAL:
        #     return
        # # if arrangement is Directions.BACKWARD:
        #     return col >= word_length - 1

    def _try_make_valid_grid(
        self, word: str, starting_position: Tuple[int, int], direction: Directions
    ) -> Optional[bool]:
        # print(f'Trying direction {direction.name} for starting position {starting_position}')
        if len(self.tried_directions) == len(Directions):
            self.word_pos = []
            return None


        if len(word) > 9:
            valid_grid = self._put_letters(
                word=word,
                starting_position=starting_position,
                grid=self.grid,
                arrangement=Directions.DIAGONAL,
            )

            if valid_grid is not None:
                self.grid = valid_grid
                return True
            else:
                self.word_pos = []
                return None

        else:
            valid_grid = self._put_letters(
                word=word,
                starting_position=starting_position,
                grid=self.grid,
                arrangement=direction,
            )

            if valid_grid is not None:
                self.grid = valid_grid
                return True
            else:
                self.word_pos = []
                return self._try_make_valid_grid(
                    word, starting_position, self._get_direction()
                )

    def _fill_grid(self):
        # rows, cols = self.grid_size
        for row, col in list(
            self.possible_positions.difference(self.invalid_positions)
        ):
            self.grid[row][col] = choice(
                [
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "I",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "O",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z",
                ]
            )

    def show_grid(self) -> None:
        j = 0
        print(" ", end="\t")
        for i in range(self.grid_size[0]):
            print(i, end="\t")
        print("\n")
        for row in self.grid:
            print(j, end="\t")
            j += 1

            for letter in row:
                print(f"{letter}", end="\t")

            print("\n")


if __name__ == "__main__":
    # words = ['CONCEPT', 'MIRROR', 'VISION', 'JUNGLE', 'PYTHON', 'BATTERY', 'CUPCAKE', 'ROCKET', 'DIAMOND',
    #          'FREEDOM']
    prompt = f"List out 16 english words. The maximum length of any listed word MUST be 5 letters or less."
    # chain = ai(prompt)
    prompt = f"List out 16 english words. The maximum length of any listed word MUST be 5 letters or less."
    
