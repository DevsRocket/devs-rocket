"use client";
import { createCheckoutSession } from "@/app/actions/stripe";
import { Button, buttonVariants } from "@/components/ui/button";
import { LOGIN } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export function EnrollCourse({ asLink }) {
  const router = useRouter();
  const pathname = usePathname();
  console.log("🚀 ~ EnrollCourse ~ pathname:", pathname);
  const { data: session } = useSession();

  const formAction = async (data) => {
    if (!session) {
      router.push(`${LOGIN}?redirect=${pathname}`);
      return;
    }

    const { url } = await createCheckoutSession(data);
    window.location.assign(url);
  };

  return (
    <>
      <form action={formAction}>
        {asLink ? (
          <Button
            type="submit"
            variant="ghost"
            className="text-xs text-sky-700 h-7 gap-1"
          >
            Enroll
            <ArrowRight className="w-3" />
          </Button>
        ) : (
          <Button type="submit" className={cn(buttonVariants({ size: "lg" }))}>
            Enroll Now
          </Button>
        )}
      </form>
    </>
  );
}
