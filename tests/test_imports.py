"""
Basic tests for an application.

This ensures all modules are importable and that the config is valid.
"""

def test_import_app():
    from tag_interaction_widget.application import TagInteractionWidgetApplication
    assert TagInteractionWidgetApplication

def test_config():
    from tag_interaction_widget.app_config import TagInteractionWidgetConfig

    config = TagInteractionWidgetConfig()
    assert isinstance(config.to_dict(), dict)

def test_ui():
    from tag_interaction_widget.app_ui import TagInteractionWidgetUI
    assert TagInteractionWidgetUI

def test_state():
    from tag_interaction_widget.app_state import TagInteractionWidgetState
    assert TagInteractionWidgetState