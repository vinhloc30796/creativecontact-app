import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TFunction } from "i18next";

interface EmptyContactCardProps {
  t: TFunction;
}

export function EmptyContactCard({ t }: EmptyContactCardProps) {
  return (
    <div className="col-span-full">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500">Please connect with other users to see their profiles here.</p>
            <Button className="mt-4">
              Find Contacts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 