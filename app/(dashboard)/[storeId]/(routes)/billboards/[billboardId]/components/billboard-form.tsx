"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hook/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
interface BillBoardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(4),
  imageUrl: z.string().min(4),
});

type TypeFormSchema = z.infer<typeof formSchema>;

function BillBoardForm({ initialData }: BillBoardFormProps) {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const desc = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard Created.";
  const action = initialData ? "Save Changes" : "Create";
  const form = useForm<TypeFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: "", imageUrl: "" },
  });
  const onSubmit = async (data: TypeFormSchema) => {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error) {
      toast.error(
        "Make sure you remove all categories deleting this billboard."
      );
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onclose={() => setOpen(false)}
        loading={form.formState.isSubmitting}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={desc} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={form.formState.isLoading}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                    onRemove={() => {
                      field.onChange("");
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Separator />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Billboard label"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}

export default BillBoardForm;
