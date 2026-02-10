import logging

from pydoover.cloud.processor import ProcessorBase

from .app_config import TagInteractionWidgetConfig

log = logging.getLogger(__name__)


class TagInteractionWidgetProcessor(ProcessorBase):
    """
    Tag Interaction Widget Processor.

    Minimal processor skeleton that receives channel messages and
    can read/write tag values. Customize the process() method to
    implement your logic.
    """

    def setup(self):
        """Called once before processing the message."""
        self._config = TagInteractionWidgetConfig()
        if self.deployment_config:
            self._config._inject_deployment_config(self.deployment_config)

    def process(self):
        """Process the incoming message."""
        if self.message is None:
            log.info("No message to process")
            return

        data = self.message.data
        log.info(f"Received message for agent {self.agent_id}")

        # Minimal skeleton - customize to read/write tags as needed.
        # Example:
        #   channel = self.fetch_channel_named("tag_values")
        #   current_state = channel.get_aggregate()

    def close(self):
        """Called once after processing is complete."""
        pass
