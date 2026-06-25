import { toast } from '@spartan-ng/brain/sonner';
import { describeHttpError } from '../../../../libs/prompt-kit/http-error';

/**
 * Run an async action and surface any failure as an error toast (message via
 * describeHttpError). Used by page components so error handling is consistent
 * and out-of-band rather than inline.
 */
export async function runGuarded(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (err) {
    toast.error(describeHttpError(err));
  }
}
