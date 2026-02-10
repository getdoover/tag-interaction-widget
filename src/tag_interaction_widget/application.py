import json
import logging
import time

from pydoover.cloud.processor import ProcessorBase

from .app_config import TagInteractionWidgetConfig

log = logging.getLogger(__name__)

WIDGET_NAME = "TagInteraction"
FILE_CHANNEL = "tag_interaction"


class TagInteractionWidgetProcessor(ProcessorBase):
    """
    Tag Interaction Widget Processor.

    On each invocation, pushes ui_state so the widget appears in the
    UI interpreter, then processes incoming messages.
    """

    def setup(self):
        """Called once before processing the message."""
        self._config = TagInteractionWidgetConfig()
        if self.deployment_config:
            self._config._inject_deployment_config(self.deployment_config)

    def process(self):
        """Process the incoming message."""
        self._push_ui_state()

        if self.message is None:
            log.info("No message to process")
            return

        data = self.message.data
        log.info(f"Received message for agent {self.agent_id}")

    def _push_ui_state(self):
        """Push ui_state with the widget entry so it appears in the interpreter.

        Includes a version timestamp so the frontend can detect redeployments
        and bust the cache for the widget JS file.
        """
        ui_state = {
            "state": {
                "children": {
                    WIDGET_NAME: {
                        "type": "uiRemoteComponent",
                        "name": WIDGET_NAME,
                        "componentUrl": FILE_CHANNEL,
                        "version": str(int(time.time())),
                        "children": {},
                    }
                }
            }
        }

        self.api.publish_to_channel_name(
            agent_id=self.agent_id,
            channel_name="ui_state",
            data=json.dumps(ui_state),
        )
        log.info(f"Pushed ui_state with {WIDGET_NAME} widget entry")

    def close(self):
        """Called once after processing is complete."""
        pass
