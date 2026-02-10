# Widget Template & Add-Widget Skill Improvement Notes

Notes collected during development of the tag-interaction-widget. These are observations about what the **widget-template repo** and **add-widget skill** should be updated with to reduce repeated work across future widget projects.

---

## 1. Node Version Requirement

**Problem:** RSBuild and `@module-federation/enhanced` require Node 18+. The default system Node (v12) fails with `Unexpected token '?'` (optional chaining not supported). This has come up twice now — during the initial widget-template setup and again here.

**Template improvement:** Consider adding an `.nvmrc` file to the widget folder with `18` (or `lts/*`) so that developers using nvm can just run `nvm use`. Also consider adding a node version check to the build script, or at minimum a note in package.json engines field.

**Skill improvement:** The add-widget skill should mention the Node 18+ requirement in its output summary / next steps.

---

## 2. npm install Not Run Automatically — DONE

**Problem:** After cloning the widget-template and running rename.js, the widget folder has a package.json but no node_modules. The developer needs to manually `cd {widget-folder} && npm install` before they can build. This is mentioned in the skill's "Next steps" output, but is easy to miss.

**Skill improvement:** Consider having the skill run `npm install` as a final step (after doover_config.json update). This would make the widget immediately buildable. The tradeoff is build time, but it's a one-time cost and prevents confusion.

**Resolution:** Added Step 8 to add-widget skill that runs `npm install` inside the widget directory. Summary updated to show `npm run build` as the only remaining next step.

---

## 3. Three-Layer Component Pattern Is Boilerplate

**Problem:** Every widget needs the same three-layer wrapper pattern:
1. `RemoteComponentWrapper` (provides React Query / Refine context)
2. Hooks wrapper with `useRemoteParams()` + `useAgent()` + loading state
3. Inner component (actual UI)

This is ~30 lines of boilerplate that every widget must have. The current template includes it, which is good, but after rename.js runs, the developer still needs to understand which parts to keep vs replace.

**Template improvement:** The layer comments are helpful. Consider making the separation even clearer — perhaps the wrapper layers could be in a separate file (e.g., `wrapper.js`) that the main component file imports, so developers only edit the inner component file. This would also mean rename.js doesn't need to update wrapper boilerplate names.

**Alternative:** Keep it in one file (current approach) but ensure the "replace this" comments are very prominent. The current template does this well.

---

## 4. agentId Must Be Passed Explicitly — DONE

**Problem:** The hooks wrapper gets `agentId` from `useRemoteParams()`, but the inner component needs it for dataProvider calls. In the initial template, `agentId` wasn't passed down — only `agent` was. We had to add `agentId={agentId}` to the props when building the tag-interaction widget.

**Template improvement:** The widget-template should pass `agentId` alongside `agent` in the hooks wrapper, so the inner component has both available without the developer needing to figure this out. Currently the template does NOT pass agentId — this needs to be fixed.

**Resolution:** Updated widget-template: hooks wrapper now passes `agentId={agentId}` to inner component, inner component destructures `{ agent, agentId, ui_element_props }`, and header comment updated to list `agentId`.

---

## 5. dataProvider Methods Not Obvious — DONE

**Problem:** The template header comments mention `dataProvider.getChannel()` and `dataProvider.sendMessage()`, but for tags we actually needed `dataProvider.updateAggregate()` (PATCH semantics — merges with existing data). The difference between sendMessage (creates a message, doesn't update aggregate) and updateAggregate (patches the channel's current state) is important and non-obvious.

**Template improvement:** The header comments should mention all three key methods:
- `getChannel()` — read channel state
- `sendMessage()` — send a message (append to history)
- `updateAggregate()` — update channel state (PATCH/merge)

And briefly note when to use each.

**Resolution:** Updated widget-template header comments to document all three methods with brief descriptions. Also updated add-widget skill's Data Access reference to include `updateAggregate()`.

---

## 6. tag_values Channel Convention

**Observation:** The `tag_values` channel is a well-known convention in Doover for key-value state. It's the primary way apps share state on a device. This is documented in the pydoover/platform-docs skill but not in the widget template itself.

**Template improvement:** Not necessarily something to add to the template (it's app-specific), but the add-widget skill could mention common channel names (tag_values, ui_state, ui_cmds) in a brief reference section, or link to the platform docs skill.

---

## 7. JSON Value Parsing Pattern

**Problem:** When setting tag values from a text input, we need to handle the fact that the user types a string but might mean a number, boolean, or object. The pattern we used:
```js
let parsed;
try { parsed = JSON.parse(inputStr); } catch { parsed = inputStr; }
```
This is a common pattern that any widget with user input will need.

**Observation:** This is app-specific logic, not template-level. No change needed.

---

## 8. ConcatenatePlugin Output Goes to ../assets/

**Observation:** The ConcatenatePlugin writes to `../assets/` relative to the widget folder. When a widget is added to an app, this means `{app-dir}/assets/{WidgetName}.js`. This matches the `file_deployments.files[].file_dir` pattern in doover_config.json. Multiple widgets in the same app would all output to the same `assets/` folder, which is correct.

**Skill improvement:** The add-widget skill should verify that if multiple widgets exist, their ConcatenatePlugin outputs don't collide (they won't, since each uses its own PascalCase name). No action needed, but worth noting.

---

## 9. package-lock.json in Template

**Observation:** The widget-template repo includes package-lock.json for reproducible installs. When the add-widget skill clones the template and runs rename.js, the lockfile stays as-is (rename.js doesn't modify it, and it doesn't contain the widget name). After `npm install`, it gets regenerated. This is fine — the lockfile from the template ensures the first install uses known-good versions.

**No change needed.**

---

## 10. .gitignore Patterns for Multi-Widget Apps — DONE

**Problem:** The add-widget skill adds `{kebab-name}/node_modules/` and `{kebab-name}/dist/` to .gitignore. If an app has multiple widgets, each gets its own entry. A simpler pattern might be `**/node_modules/` and `**/dist/` which covers all widgets at once.

**Skill improvement:** Consider using glob patterns in .gitignore instead of widget-specific paths. `**/node_modules/` and `**/dist/` are more maintainable for multi-widget apps. Still need `assets/` as a top-level entry.

**Resolution:** Updated add-widget skill Step 7 to use `**/node_modules/` and `**/dist/` glob patterns instead of widget-specific paths.

---

## 11. serve Package for Local Development

**Observation:** The template includes `serve` as a dependency for `npm run start` (serves the built assets on port 8001 for ngrok tunneling). Every widget needs this for local development. It's correctly included in the template's package.json.

**No change needed.**

---

## 12. Error Handling UX Pattern

**Observation:** The tag-interaction widget uses a simple error/success state pattern with colored text feedback. This is a common need for any widget that makes async API calls. Not template-level, but could be useful as a documented pattern.

**Possible template improvement:** Could include a commented-out example of async error handling in the inner component, since almost every widget will need it.

---

## 13. deployment_channel_messages Does NOT Work in Doover 2.0 — CRITICAL

**Problem:** The `deployment_channel_messages` field in `doover_config.json` is a Doover 1.x feature. The Doover 2.0 backend has **zero references** to this field — it is never read or processed. This means that simply adding a `ui_state` entry to `deployment_channel_messages` will NOT cause the widget to appear in the UI interpreter on Doover 2.0.

**Root cause:** Doover 2.0 uses an event-driven model. The processor receives a `deployment` event and must programmatically push UI state using pydoover2's `Application` class.

**Solution (Doover 2.0):** The app's processor must:
1. Subclass `pydoover.cloud.processor.Application`
2. In `setup()`, call `self.ui_manager.set_children()` with `RemoteComponent` entries
3. In `on_deployment()`, call `await self.ui_manager.push_async(even_if_empty=True)`

**Example (from tag-interaction-widget):**
```python
from pydoover.cloud.processor import Application, DeploymentEvent
from pydoover.ui import RemoteComponent

WIDGET_NAME = "TagInteraction"
FILE_CHANNEL = "tag_interaction"

class TagInteractionWidgetApp(Application):
    async def setup(self):
        self.ui_manager.set_children([
            RemoteComponent(
                name=WIDGET_NAME,
                display_name=WIDGET_NAME,
                component_url=FILE_CHANNEL,
            ),
        ])

    async def on_deployment(self, event: DeploymentEvent):
        await self.ui_manager.push_async(even_if_empty=True)
```

And in `__init__.py`:
```python
from pydoover.cloud.processor import run_app
app = TagInteractionWidgetApp(config=TagInteractionWidgetConfig())

def handler(event, context):
    return run_app(app, event, context)
```

**Key details:**
- `RemoteComponent.component_url` should be the snake_case channel name (e.g., `tag_interaction`) — this matches the `file_deployments` channel name
- `pydoover>=0.4.18` is required for the `Application` class and `RemoteComponent`
- `deployment_channel_messages` can still be kept in doover_config.json for Doover 1.x backward compatibility, but the processor is the authoritative source for Doover 2.0

**Template improvement:** The widget-template's processor boilerplate should include the `on_deployment()` + `RemoteComponent` pattern out of the box.

**Skill improvement:** The add-widget skill should:
1. Generate processor code that includes the `on_deployment()` hook (or instruct the user to add it)
2. Document that `deployment_channel_messages` alone is insufficient for Doover 2.0
3. Mention `pydoover>=0.4.18` as a dependency requirement

---

## 14. Cache-Busting Limitation in Doover 2.0 Frontend

**Problem:** When a widget's JS file is updated and redeployed, the Doover 2.0 frontend may serve the cached version. The `ChannelRemoteComponent` in the frontend loads the widget JS from `channel.attachments[0].url`. However, `useAgentChannel` has `refetchInterval: Infinity` and the WebSocket handler only updates `last_message` and `aggregate` — NOT `attachments`. This means the old JS URL persists until a full page refresh.

**Observation:** This is a Doover 2.0 frontend limitation, not something the app developer can work around. The file deployment mechanism does update the channel attachment with a new URL (S3 presigned URL with new upload), but the frontend doesn't pick it up via WebSocket.

**Potential fix (Doover 2.0 team):** Either:
1. Include `attachments` in the WebSocket update payload
2. Set a reasonable `refetchInterval` on `useAgentChannel` for remote component channels
3. Use a version/hash field in the channel aggregate that the `RemoteHost` component checks

**No action needed from widget developers.** Just be aware that after redeployment, users may need to refresh the page to see the updated widget.

---

## Summary of Actionable Items

**Widget template (getdoover/widget-template):**
1. Add `.nvmrc` with Node 18 requirement
2. ~~Pass `agentId` from hooks wrapper to inner component~~ — DONE
3. ~~Update header comments to document `updateAggregate()` alongside `getChannel()` and `sendMessage()`~~ — DONE
4. Consider `engines` field in package.json
5. Include processor boilerplate with `on_deployment()` + `RemoteComponent` pattern for Doover 2.0

**Add-widget skill (doover-skills):**
1. Mention Node 18+ requirement in summary output
2. ~~Consider running `npm install` as a final step~~ — DONE
3. ~~Use `**/node_modules/` and `**/dist/` glob patterns in .gitignore instead of widget-specific paths~~ — DONE
4. Optionally mention common channel names (tag_values, ui_state, ui_cmds)
5. Document that `deployment_channel_messages` is Doover 1.x only — processor must push ui_state via `on_deployment()` for Doover 2.0
6. Generate or instruct user to add `on_deployment()` + `RemoteComponent` pattern in processor

**Doover 2.0 frontend (for Doover team):**
1. Fix cache-busting: WebSocket should update `attachments` or `useAgentChannel` should have finite refetch interval
