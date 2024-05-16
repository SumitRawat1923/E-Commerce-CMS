"use client";
import React, { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";
interface AlertModalProps {
  isOpen: boolean;
  onclose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
function AlertModal({ isOpen, loading, onConfirm, onclose }: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onclose}
    >
      <div className="pt-6 flex justify-end items-center w-full space-x-2 ">
        <Button disabled={loading} variant={"outline"} onClick={onclose}>
          Cancel
        </Button>
        <Button disabled={loading} variant={"destructive"} onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}

export default AlertModal;
