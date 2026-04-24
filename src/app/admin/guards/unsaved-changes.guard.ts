import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  isDirty(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (!component.isDirty()) return true;
  return confirm('You have unsaved changes. Leave without saving?');
};
