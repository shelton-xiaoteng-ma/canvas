import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIssueModal } from "@/features/subscriptions/store/use-issue-modal";
import { MailIcon } from "lucide-react";

const EMAIL_ADDRESS = "shelton.xiaoteng.ma@gmail.com";

export const IssueModal = () => {
  const { isOpen, close: closeModal } = useIssueModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-4 pb-2 text-3xl">
            Contact Me
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-base">
          <p>
            Due to issues with my Stripe account, Pro users are currently unable
            to upgrade via the website.
          </p>
          <p>If you need assistance, please feel free to email me:</p>
          <div className="flex items-center gap-2">
            <MailIcon />
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="underline hover:text-blue-500"
            >
              {EMAIL_ADDRESS}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
