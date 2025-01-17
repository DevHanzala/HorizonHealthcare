"use client";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { updateRequest } from "@/actions/requests";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import DoctorCard from "./DoctorCard";

export default function DoctorRequests({ requests, status }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState({
    type: null,
    requestId: null,
  });
  const [activeFilter, setActiveFilter] = useState(status);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleAction = (type, requestId) => {
    setSelectedAction({ type, requestId });
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (selectedAction.type === "accept") {
      console.log("selectedAction=>", selectedAction);
      await updateRequest(selectedAction.requestId, "accepted");
    } else if (selectedAction.type === "reject") {
      console.log("selectedAction=>", selectedAction);
      await updateRequest(selectedAction.requestId, "rejected");
    }
    setDialogOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (activeFilter) {
      params.set("status", activeFilter);
      params.set("page", "1");
      params.set("limit", "30");
    } else {
      params.delete("status");
    }

    // Update the URL using router.replace
    router.replace(`${pathname}?${params.toString()}`);

    console.log("params=>", params.toString());
  }, [activeFilter, pathname, router, searchParams]);

  const renderRequestCard = (request) => (
    <DoctorCard
      key={request._id}
      request={request}
      isAdmin={true}
      onAccept={() => handleAction("accept", request._id)}
      onReject={() => handleAction("reject", request._id)}
    />
  );

  return (
    <>
      <div className="grid w-full md:gap-4 md:w-1/2 mx-auto md:grid-cols-4 grid-cols-2">
        <div
          className={`border-secondory cursor-pointer p-3 my-4 text-center border rounded ${
            activeFilter === "all" && "bg-primary text-center text-white"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </div>
        <div
          className={`border-secondory cursor-pointer p-3 my-4 text-center border rounded ${
            activeFilter === "pending" && "bg-primary text-center text-white"
          }`}
          onClick={() => setActiveFilter("pending")}
        >
          Pending
        </div>
        <div
          className={`border-secondory cursor-pointer p-3 my-4 text-center border rounded ${
            activeFilter === "accepted" && "bg-primary text-center text-white"
          }`}
          onClick={() => setActiveFilter("accepted")}
        >
          Accepted
        </div>
        <div
          className={`border-secondory cursor-pointer p-3 my-4 text-center border rounded ${
            activeFilter === "rejected" && "bg-primary text-center text-white"
          }`}
          onClick={() => setActiveFilter("rejected")}
        >
          Rejected
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {requests.map(renderRequestCard)}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedAction.type} this doctor
              request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
