"use client";
import React from "react";
import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(4),
});

type TformSchema = z.infer<typeof formSchema>;

export default function StoreModal() {
  const storeModal = useStoreModal();
  const form = useForm<TformSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: TformSchema) => {
    try {
      const response = await axios.post("/api/stores", values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage your e-commerce site"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-x-4 py-2 pb-4 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                type="button"
                disabled={form.formState.isSubmitting}
                variant={"outline"}
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
