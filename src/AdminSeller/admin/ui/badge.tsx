import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import clsx from "clsx";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      // Seller/Admin status
      variant: {
        default:
          "border-transparent bg-gray-400 text-white [a&]:hover:bg-gray-500", // active / in-stock
        inactive :
          "border-transparent bg-blue-600 text-white [a&]:hover:bg-blue-700", // inactive
        outOfStock:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-700", // out of stock
        // Sales status
        completed:
          "border-transparent bg-gray-700 text-white [a&]:hover:bg-gray-800", // completed sale
        pending:
          "border-transparent bg-blue-600 text-white [a&]:hover:bg-blue-700", // pending sale
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);




function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={clsx(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
