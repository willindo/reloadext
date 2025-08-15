import { useSession } from "next-auth/react";

// Declare the type for session data in the ambient context
declare const session: ReturnType<typeof useSession>["data"];