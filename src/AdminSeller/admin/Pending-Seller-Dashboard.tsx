import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Building,
  FileText,
} from "lucide-react";

// Placeholder hook
const useAuth = () => ({
  user: { email: "seller@example.com", name: "John Doe" },
});

export default function PendingSellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-900">
                Application Under Review
              </h3>
              <p className="text-orange-700">
                Your seller application is currently being reviewed by our admin
                team. You'll receive an email notification once your application
                is approved.
              </p>
            </div>
            <Badge
              variant="pending"
              className="border-orange-300 text-orange-700"
            >
              Pending Approval
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span>What happens next?</span>
          </CardTitle>
          <CardDescription>
            Here's what you can expect during the review process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium text-card-foreground">
                  Application Review
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team will review your business information and verify your
                  details.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium text-card-foreground">
                  Email Notification
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email with the approval decision within 2-3
                  business days.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-card-foreground">
                  Start Selling
                </p>
                <p className="text-sm text-muted-foreground">
                  Once approved, you'll gain access to the seller dashboard and
                  can start listing products.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Application Summary</CardTitle>
          <CardDescription>
            Review the information you submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Email
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Business Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    John's Electronics
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Phone
                  </p>
                  <p className="text-sm text-muted-foreground">+1234567890</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Business Type
                  </p>
                  <p className="text-sm text-muted-foreground">Electronics</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Contact our support team if you have any questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
