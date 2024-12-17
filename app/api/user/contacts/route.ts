import getServerSideUser from "@/lib/getServerSideUser";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteContactWithContactId } from "./helper";

export const deleteContactSchema = z.object({
  contactId: z.string().uuid(),
});

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerSideUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId } = deleteContactSchema.parse(await request.json());
    const result = await deleteContactWithContactId(user.id, contactId);
    if (!result.result) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    return NextResponse.json({ error: `Failed to delete contact \n ${err}` }, { status: 500 });
  }
}
