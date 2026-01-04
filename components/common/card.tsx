import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

export function Card({
  asChild,
  className = "",
  children,
  ...props
}: CardProps) {
  const classes = [
    "rounded-2xl",
    "bg-(--surface)",
    "border border-(--border-subtle)",
    "shadow-sm",
    className,
  ].join(" ");

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string;
    }>;

    return React.cloneElement(child, {
      ...props,
      className: [classes, child.props.className].filter(Boolean).join(" "),
    });
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
