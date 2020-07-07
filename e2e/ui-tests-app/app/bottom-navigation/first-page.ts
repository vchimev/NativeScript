import { EventData } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";

export function goToSecond(args: EventData) {
  console.log("---> goToSecond Page");
  const button = <Button>args.object;
  button.page.frame.navigate("bottom-navigation/second-page");
}

export function goBack(args: EventData) {
  console.log("---> goBack");
  const button = <Button>args.object;
  button.page.frame.goBack();
}
