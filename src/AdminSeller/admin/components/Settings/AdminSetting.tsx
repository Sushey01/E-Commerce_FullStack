import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

const AdminSetting: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground">
        System Settings
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure system preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Email Notifications</span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Payment Settings</span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Security Settings</span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Version</span>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Last Updated</span>
              <span className="text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">System Status</span>
              <Badge variant="default">Healthy</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetting;
