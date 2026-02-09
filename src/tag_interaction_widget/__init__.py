from pydoover.docker import run_app

from .application import TagInteractionWidgetApplication
from .app_config import TagInteractionWidgetConfig

def main():
    """
    Run the application.
    """
    run_app(TagInteractionWidgetApplication(config=TagInteractionWidgetConfig()))
