from .application import TagInteractionWidgetProcessor
from .app_config import TagInteractionWidgetConfig


def handler(event, context):
    """Lambda handler entry point."""
    processor = TagInteractionWidgetProcessor(**event)
    processor.execute()
