"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Textarea } from "@/components/ui/prebuilt-components/textarea";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { approveHomestay, rejectHomestay } from "../actions";
import { toast } from "sonner";
import type { AdminHomestayDetails } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { routeParamSchema } from "@/lib/validation/adminSchemas";
import { sanitizedString } from "@/lib/validation/commonSchemas";

const decisionSchema = z
  .object({
    reason: sanitizedString(10, 500, "Rejection reason"),
  })
  .strict();

type DecisionValues = z.infer<typeof decisionSchema>;

export default function DecisionSection({
  homestay,
  onClose,
}: {
  homestay: AdminHomestayDetails;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<DecisionValues>({
    resolver: zodResolver(decisionSchema),
    mode: "onChange",
    defaultValues: { reason: "" },
  });

  const homestayId = routeParamSchema.safeParse({ id: homestay.id });
  const safeHomestayId = homestayId.success ? homestayId.data.id : null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Final decision
        </h2>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Review carefully. This action affects platform trust and visibility.
        </p>
      </div>

      <Textarea
        placeholder="Rejection reason (required only if rejecting)"
        {...register("reason")}
        className="bg-white border-mitti-khaki focus:border-mitti-olive"
      />
      {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}

      <div className="flex gap-4 pt-2">
        {/* APPROVE */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending || !safeHomestayId}
              className="flex-1 bg-mitti-olive hover:bg-mitti-olive/90 text-white"
            >
              Approve homestay
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-mitti-dark-brown">
                Approve this homestay?
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-mitti-olive hover:bg-mitti-olive/90 text-white"
                onClick={() =>
                  startTransition(async () => {
                    if (!safeHomestayId) {
                      toast.error("Invalid homestay identifier.");
                      return;
                    }
                    await approveHomestay(safeHomestayId);
                    toast.success("Homestay approved");
                    onClose();
                  })
                }
              >
                Confirm approval
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* REJECT */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending || !safeHomestayId}
              className="flex-1 bg-[#C94A3F] hover:bg-[#B34238] text-white"
            >
              Reject homestay
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-mitti-dark-brown">
                Reject this homestay?
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-[#C94A3F] hover:bg-[#B34238] text-white"
                onClick={() =>
                  startTransition(async () => {
                    if (!safeHomestayId) {
                      toast.error("Invalid homestay identifier.");
                      return;
                    }

                    const valid = await trigger("reason");
                    if (!valid || !isValid) {
                      toast.error("A valid rejection reason is required.");
                      return;
                    }

                    await rejectHomestay(safeHomestayId, getValues("reason"));
                    toast.success("Homestay rejected");
                    onClose();
                  })
                }
              >
                Confirm rejection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}