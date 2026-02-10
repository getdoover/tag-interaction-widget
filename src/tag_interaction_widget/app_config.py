from pathlib import Path

from pydoover import config


class TagInteractionWidgetConfig(config.Schema):
    def __init__(self):
        pass


def export():
    TagInteractionWidgetConfig().export(
        Path(__file__).parents[2] / "doover_config.json",
        "tag_interaction_widget",
    )


if __name__ == "__main__":
    export()
