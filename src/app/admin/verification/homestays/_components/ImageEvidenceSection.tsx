import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/prebuilt-components/dialog";

export default function ImageEvidenceSection({ homestay }: { homestay: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-mitti-dark-brown">
        Image Evidence
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {homestay.imageUrl.map((url: string, idx: number) => (
          <Dialog key={idx}>
            <DialogTrigger asChild>
              <div className="relative aspect-square cursor-zoom-in rounded-md overflow-hidden border border-mitti-khaki">
                <Image src={url} alt="" fill className="object-cover" />
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-0 bg-black">
              <Image
                src={url}
                alt=""
                width={1400}
                height={900}
                className="w-full h-auto"
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
