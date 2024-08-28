import Select from "react-select";
import { User } from "./types/user";
import { useCallback, useEffect, useState } from "react";

type ControlsProps = {
  users: User[];
  setSortedUsers: (users: User[]) => void;
};

const Controls = ({ 
  users = [],
  setSortedUsers
 }: ControlsProps) => {

  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("ascending");

  const fieldOptions = [
    { label: "Name", value: "name" },
    { label: "Company", value: "company" },
    { label: "Email", value: "email" },
  ];
  const directionOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
  ];

  const getValue = useCallback((obj: any, field: string) => {
    return field.split('.').reduce((o, key) => (o ? o[key] : ""), obj)
  }, [])

  const sortUsers = useCallback((field: string, direction: string) => {
    const sorted = [...users].sort((a, b) => {
      let aValue = getValue(a, field)
      let bValue = getValue(b, field)

      // condition: if values are objects
      if (typeof aValue === 'object' && aValue !== null) {
        aValue = JSON.stringify(aValue)
      }
      if (typeof bValue === 'object' && bValue !== null) {
        bValue = JSON.stringify(bValue)
      }

      aValue = aValue.toString().toLowerCase()
      bValue = bValue.toString().toLowerCase()

      if (aValue < bValue) return direction === "ascending" ? -1 : 1
      if (aValue > bValue) return direction === "ascending" ? 1 : -1
      return 0
    })

      setSortedUsers(sorted)
      
  }, [users, setSortedUsers, getValue])

  useEffect(() => {
    sortUsers(sortField, sortDirection)
  }, [sortField, sortDirection, users, sortUsers])

  const handleFieldChange = (selected: any) => {
    setSortField(selected?.value || "name")
  }

  const handleDirectionChange = (selected: any) => {
    setSortDirection(selected?.value || "asc")
  }

  return (
    <div className="gallery-controls controls">
      <div className="form-group group">
        <label htmlFor="sort-field" className="label">
          Sort Field
        </label>
        <Select 
          options={fieldOptions} 
          inputId="sort-field" 
          className="input" 
          onChange={handleFieldChange}
          defaultValue={fieldOptions.find(option => option.value === sortField)}
        />
      </div>
      <div className="form-group group">
        <label htmlFor="sort-direction" className="label">
          Sort Direction
        </label>
        <Select
          options={directionOptions}
          inputId="sort-direction"
          className="input"
          onChange={handleDirectionChange}
          defaultValue={directionOptions.find(option => option.value === sortDirection)}
        />
      </div>
    </div>
  );
};

export default Controls;
