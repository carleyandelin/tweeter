#!/bin/bash

set -e

ROLE_ARN="arn:aws:iam::412381763156:role/service-role/GetStartedLambdaBasicExecutionRole"
REGION="us-west-2"
ZIP_FILE="lambda.zip"

echo "Building tweeter-server..."
npm run compile

echo "Zipping dist + node_modules..."
cd dist
zip -r ../$ZIP_FILE . > /dev/null
cd ..
zip -r $ZIP_FILE node_modules > /dev/null

deploy_lambda() {
  local FUNCTION_NAME=$1
  local HANDLER=$2

  echo "Deploying $FUNCTION_NAME..."

  if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION > /dev/null 2>&1; then
    aws lambda update-function-code \
      --function-name $FUNCTION_NAME \
      --zip-file fileb://$ZIP_FILE \
      --region $REGION > /dev/null

    # Wait for the code update to complete before updating configuration
    aws lambda wait function-updated \
      --function-name $FUNCTION_NAME \
      --region $REGION

    aws lambda update-function-configuration \
      --function-name $FUNCTION_NAME \
      --handler $HANDLER \
      --region $REGION > /dev/null

    # Wait for configuration update to complete
    aws lambda wait function-updated \
      --function-name $FUNCTION_NAME \
      --region $REGION

    echo "  Updated $FUNCTION_NAME"
  else
    aws lambda create-function \
      --function-name $FUNCTION_NAME \
      --runtime nodejs18.x \
      --role $ROLE_ARN \
      --handler $HANDLER \
      --zip-file fileb://$ZIP_FILE \
      --region $REGION \
      --timeout 10 \
      --memory-size 128 > /dev/null

    aws lambda wait function-active \
      --function-name $FUNCTION_NAME \
      --region $REGION

    echo "  Created $FUNCTION_NAME"
  fi
}

deploy_lambda "tweeter-register"           "src/lambda/register/RegisterLambda.handler"
deploy_lambda "tweeter-login"              "src/lambda/login/LoginLambda.handler"
deploy_lambda "tweeter-logout"             "src/lambda/logout/LogoutLambda.handler"
deploy_lambda "tweeter-get-user"           "src/lambda/getUser/GetUserLambda.handler"
deploy_lambda "tweeter-get-followers"      "src/lambda/getFollowers/GetFollowersLambda.handler"
deploy_lambda "tweeter-get-followees"      "src/lambda/getFollowees/GetFolloweesLambda.handler"
deploy_lambda "tweeter-get-follower-count" "src/lambda/getFollowerCount/GetFollowerCountLambda.handler"
deploy_lambda "tweeter-get-followee-count" "src/lambda/getFolloweeCount/GetFolloweeCountLambda.handler"
deploy_lambda "tweeter-is-follower"        "src/lambda/isFollower/IsFollowerLambda.handler"
deploy_lambda "tweeter-follow"             "src/lambda/follow/FollowLambda.handler"
deploy_lambda "tweeter-unfollow"           "src/lambda/unfollow/UnfollowLambda.handler"
deploy_lambda "tweeter-get-story"          "src/lambda/getStory/GetStoryLambda.handler"
deploy_lambda "tweeter-get-feed"           "src/lambda/getFeed/GetFeedLambda.handler"
deploy_lambda "tweeter-post-status"        "src/lambda/postStatus/PostStatusLambda.handler"
deploy_lambda "tweeter-post-status-fanout" "src/lambda/postStatusFanOut/PostStatusFanOutLambda.handler"
deploy_lambda "tweeter-feed-updater"       "src/lambda/feedUpdater/FeedUpdaterLambda.handler"

echo "Cleaning up zip..."
rm $ZIP_FILE

echo "All lambdas deployed successfully!"