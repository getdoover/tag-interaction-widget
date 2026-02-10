from pathlib import Path

from pydoover import config
from pydoover.cloud.processor import SubscriptionConfig


class TagInteractionWidgetConfig(config.Schema):
    def __init__(self):
        self.subscription = SubscriptionConfig(default="deployment_config")


def export():
    TagInteractionWidgetConfig().export(
        Path(__file__).parents[2] / "doover_config.json",
        "tag_interaction_widget",
    )


if __name__ == "__main__":
    export()
