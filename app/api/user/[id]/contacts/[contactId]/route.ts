import { NextRequest, NextResponse } from "next/server";
import { deleteContactWithContactId } from "./helper";

export async function DELETE(
  _request: NextRequest,
  props: {
    params: Promise<{
      id: string; // userId
      contactId: string
    }>
  }) {
  try {
    const { id: userId, contactId } = await props.params;
    const rs = await deleteContactWithContactId(userId, contactId);
    if (!rs.result) {
      return NextResponse.json({ error: rs.error?.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Contact deleted successfully" })
  } catch (err) {
    console.error("Error deleting contact:", err);
    return NextResponse.json({ error: `Failed to delete contact \n ${err}` }, { status: 500 });
  }
}