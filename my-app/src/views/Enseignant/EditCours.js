import React from "react";

// components

import EditCourseModal from "components/Cards/EditCourseModal";

export default function EditCourse() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <EditCourseModal />
        </div>
     
      </div>
    </>
  );
}
