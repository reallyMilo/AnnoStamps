#!/bin/bash

OUTPUT_PATH="../ses_template.tf"
# Encode HTML file to Base64
ENCODED_HTML=$(base64 -w 0 CommentNotificationTemplate.html)

# Generate Terraform file
cat <<EOF > $OUTPUT_PATH
resource "aws_ses_template" "comment_notification_template" {
  name         = "CommentNotificationTemplate"
  subject = "New comment on your stamp"
  text    = "{{authorOfContent}} commented\r\n{{content}}\r\n on your stamp here: {{targetUrl}} \r\n If you wish to stop receiving email notifications please adjust your account setting preferences. \r\n {{updateSettingsUrl}}"
  html    = base64decode("${ENCODED_HTML}")
}
EOF

echo "Terraform configuration generated in ses_template.tf"