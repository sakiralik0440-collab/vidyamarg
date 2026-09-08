const names = [
  "Sakir Ali",
  "Pooja Sharma",
  "Rahul Verma",
  "Ananya Patel",
  "Vikas Meena",
  "Neha Joshi",
  "Arjun Singh",
  "Kavya Nair",
  "Rohan Gupta",
  "Ishita Rao",
  "Aditya Khan",
  "Meera Das",
  "Nitin Yadav",
  "Simran Kaur",
  "Harsh Tiwari",
  "Priya Mishra",
  "Dev Malhotra",
  "Ayesha Sheikh",
  "Manav Jain",
  "Tanvi Kulkarni",
];

const branches = ["CSE", "CSE", "ECE", "IT", "ME"];

const demoStudents = names.map((name, index) => {
  const attendance = [72, 92, 65, 89, 81, 86, 78, 94, 69, 88][index % 10];
  const cgpa = [8.2, 8.9, 5.8, 9.1, 7.4, 8.6, 7.9, 9.3, 6.7, 8.1][index % 10];

  return {
    id: `s${index + 1}`,
    name,
    rollNo: `0103${branches[index % branches.length]}21${String(1045 + index).padStart(4, "0")}`,
    branch: branches[index % branches.length],
    course: "B.Tech",
    sem: index % 3 === 0 ? 6 : 4,
    semester: index % 3 === 0 ? "Semester 6" : "Semester 4",
    college: "Institute of Engineering & Technology, DAVV",
    attendance,
    attendanceRate: attendance,
    cgpa,
    readinessScore: Math.min(96, Math.round(cgpa * 8 + attendance / 5)),
    status: attendance < 75 ? "At Risk" : index === 3 || index === 7 ? "Placed" : "Active",
    skills: ["JavaScript", "React.js", "Node.js"].slice(0, 1 + (index % 3)),
  };
});

export default demoStudents;
