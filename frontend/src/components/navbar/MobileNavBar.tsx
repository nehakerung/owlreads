import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import NavItems from "./NavItems";

const MobileNavBar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <IoMenu className="text-3xl" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-center font-bold text-xl">
            Owlreads
          </SheetTitle>
        </SheetHeader>
        
        <NavItems mobile/>

      </SheetContent>
    </Sheet>
  );
};

export default MobileNavBar;