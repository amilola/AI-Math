from typing import Dict, List
import json


def load_json(file_path: str) -> List[Dict[str, str]]:
    assert "json" in file_path, "file must be a json file"

    with open(file_path, 'r') as data_file:
        json_data = data_file.read()

    data: List[Dict[str, List]] = json.loads(json_data)
    examples: List[Dict[str, str]] = []

    for item in data:
        for k, v in item.items():
            if k == "answer":
                item[k] = "".join(v)  # type: ignore

        examples.append(item)  # type: ignore

    return examples


if __name__ == "__main__":
    print(load_json("../examples.json"))
