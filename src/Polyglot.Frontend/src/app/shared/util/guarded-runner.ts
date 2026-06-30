import { toast } from '@spartan-ng/brain/sonner';
import { describeHttpError } from '../../../../libs/prompt-kit/http-error';

export async function runGuarded(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (err) {
    toast.error(describeHttpError(err));
  }
}
