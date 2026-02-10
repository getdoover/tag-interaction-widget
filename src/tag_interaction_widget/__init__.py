from pydoover.cloud.processor import run_app

from .application import TagInteractionWidgetApp
from .app_config import TagInteractionWidgetConfig


def handler(event, context):
    """Lambda handler entry point."""
    TagInteractionWidgetConfig.clear_elements()
    return run_app(
        TagInteractionWidgetApp(config=TagInteractionWidgetConfig()),
        event,
        context,
    )
