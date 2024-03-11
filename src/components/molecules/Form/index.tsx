import { ReactNode } from "react";
import { Control } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IFormInputProps {
  name: string;
  placeholder?: string;
  control?: Control<any>;
  className?: string;
  type: "text" | "password" | "email";
  icon?: ReactNode;
}

const FormInputElement = ({
  name,
  control,
  className,
  placeholder,
  type,
  icon,
}: IFormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {icon ?? null}
              </span>
              <Input
                placeholder={placeholder}
                className={cn(icon ? "block pl-12 w-full" : "", className)}
                type={type}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormInput = (props: Omit<IFormInputProps, "type">) => {
  return <FormInputElement {...props} type="text" />;
};

const FormEmailInput = (props: Omit<IFormInputProps, "type">) => {
  return <FormInputElement {...props} type="email" />;
};

const FormPassword = (props: Omit<IFormInputProps, "type">) => {
  return <FormInputElement {...props} type="password" />;
};

export { FormInput, FormPassword, FormEmailInput };
