# Deploy Upload UI Design

## Goal

Bring the deploy endpoint upload experience in line with the Astral design prompt by replacing the current compatibility-style presentation with a compact, polished operational UI that feels consistent with the rest of the product.

The redesign covers:

- `src/features/deploy/components/DeployEndpointPanel.tsx`
- `src/features/deploy/components/UpDataDeploy.tsx`

The work keeps current upload behavior and callback flow intact unless a small local cleanup is required to support the new UI.

## Scope

### In scope

- Refine the endpoint information panel to better match Astral visual hierarchy.
- Redesign the upload modal as a feature-owned, Tailwind-first modal surface.
- Improve validation feedback, file summary presentation, and action layout.
- Remove obvious prompt violations in these components, especially ad hoc modal styling and inline-style-heavy UI.

### Out of scope

- Changing upload API contracts.
- Reworking deploy prediction behavior.
- Refactoring unrelated deploy panels.
- Introducing new global CSS or modifying `src/components/ui` for feature-specific behavior.

## Recommended Approach

Use a feature-owned redesign that keeps behavior stable while modernizing the visual structure.

This approach is preferred because it:

- Fixes the component that diverges most from the design prompt.
- Preserves the existing deploy flow and integration points.
- Limits risk by avoiding a larger page-wide redesign.

## Architecture

### `DeployEndpointPanel`

Keep the component as the entry point for endpoint copy, upload, and generated UI actions, but tighten the layout:

- Use one clear header row with icon, title, and short supporting text.
- Present the endpoint URL inside a dedicated bordered field area rather than as a loose input row.
- Group actions into a compact control cluster that reads as operational tools rather than generic buttons.
- Preserve `UpDataDeploy` ownership inside the panel so the upload flow remains local to the deploy feature.

### `UpDataDeploy`

Refactor the modal presentation into a focused operational dialog:

- Compact header with title and supporting description.
- Primary dropzone panel with restrained blue-led accent states.
- Secondary support panel describing accepted formats and limits.
- Validation state panel for success and error messages.
- Selected content panel showing uploaded file tree and total file count.
- Footer with secondary cancel and primary upload actions.

The component remains feature-owned and self-contained. Private helper types stay in the file unless they become shared for real use cases.

## Data Flow

The current flow remains the same:

1. User opens the upload modal from `DeployEndpointPanel`.
2. User selects or drops files.
3. The component verifies the selection using the existing verification path.
4. Valid selections populate local file state and folder structure state.
5. User starts upload.
6. The component requests presigned URLs, uploads files, computes the prediction prefix, closes the modal, and calls `onUploadComplete`.

No API request semantics change in this redesign.

## Component Behavior

### Endpoint panel behavior

- Keep copy URL, upload files, and generate/open UI actions.
- Preserve loading and disabled behavior for upload and UI generation actions.
- Improve scanability by separating endpoint display from actions.

### Upload modal behavior

- Keep support for multi-file and folder upload.
- Keep file-size gating and existing accepted extensions unless a small text correction is needed.
- Keep validation status gating so upload starts only from a successful verification state.
- Keep the removable tree view for selected files and folders.
- Reset local state on cancel and after successful completion.

## Visual Design

### Layout

- Use a compact modal width suitable for utility workflows.
- Use bordered panels instead of nested decorative cards.
- Keep content spacing generous enough to scan but dense enough for operational use.

### Surfaces and color

- Use crisp light-mode borders and subdued dark-mode overlays.
- Use blue as the primary accent for actions, focus, and highlighted utility states.
- Use emerald for successful validation and red for validation or upload failures.
- Avoid ornamental gradients, floating effects, and heavy shadows.

### Typography

- Use compact product-style headings.
- Keep helper text small and high contrast.
- Use labels and metadata styles consistent with the design prompt.

## Error Handling

- Missing `projectId` remains a blocking error.
- Empty selection remains a warning state.
- Upload failures continue surfacing through toast messages.
- Validation failures remain visible in-modal with clear messaging and disabled primary action.

## Testing

Manual verification is sufficient for this UI-scoped change:

- Open deploy endpoint panel and confirm endpoint URL rendering.
- Open upload modal and verify layout in light and dark mode.
- Select valid files and verify success state plus enabled upload action.
- Select invalid files and verify error state plus disabled upload action.
- Remove files and folders from the tree and verify state updates.
- Complete an upload and verify modal reset plus callback behavior.

## Risks and Mitigations

- The current component mixes compatibility wrappers with local UI logic.
  Mitigation: keep behavioral logic stable and limit the refactor to presentation plus small local cleanup.

- Inline-style usage may hide theme dependencies.
  Mitigation: move styling into Tailwind classes and only keep logic that is unrelated to presentation.

- The file tree uses path-based deletion logic that could regress during markup changes.
  Mitigation: preserve the current deletion algorithm and change only how the tree is rendered.

## Implementation Notes

- Prefer existing `src/components/ui` primitives where they fit naturally.
- Keep any modal implementation local to the feature if a dedicated shared dialog is not already in use here.
- Do not modify `src/components/ui` to support feature-specific behavior.
- Do not introduce Ant Design patterns or APIs.
