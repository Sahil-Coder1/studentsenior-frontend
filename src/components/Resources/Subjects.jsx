import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBranches } from '../../redux/slices/branchSlice.js';
import { fetchCourses } from '../../redux/slices/courseSlice.js';
import { fetchSubjects } from '../../redux/slices/subjectSlice.js';
import { toast } from 'react-toastify';
import { capitalizeWords } from '../../utils/Capitalize.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';

function Subjects() {
    const { collegeName, branchCode, courseCode } = useParams();
    const [activeSemester, setActiveSemester] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    const {
        branches,
        loading: branchesLoading,
        error: branchesError,
    } = useSelector((state) => state.branches || {});
    const {
        courses,
        loading: coursesLoading,
        error: coursesError,
    } = useSelector((state) => state.courses || {});
    const {
        subjects,
        loading: subjectsLoading,
        error: subjectsError,
    } = useSelector((state) => state.subjects || {});

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [groupedSubjects, setGroupedSubjects] = useState({});

    // Fetch courses if not already fetched
    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchCourses());
        }
    }, [dispatch, courses.length]);

    // Find selected course when courses are fetched
    useEffect(() => {
        if (courses.length) {
            const foundCourse = courses.find(
                (course) =>
                    course.courseCode.toLowerCase() === courseCode.toLowerCase()
            );
            if (foundCourse) {
                setSelectedCourse(foundCourse);
            } else {
                toast.error('Course not found for courseCode');
            }
        }
    }, [courses, courseCode]);

    // Fetch branches when selected course is found
    useEffect(() => {
        if (selectedCourse && !branches.length) {
            dispatch(fetchBranches(selectedCourse._id));
        }
    }, [selectedCourse, dispatch, branches.length]);

    // Find selected branch when branches are fetched
    useEffect(() => {
        if (branches.length) {
            const foundBranch = branches.find(
                (branch) =>
                    branch.branchCode.toLowerCase() === branchCode.toLowerCase()
            );
            if (foundBranch) {
                setSelectedBranch(foundBranch);
            } else {
                toast.error('Branch not found for branchCode');
            }
        }
    }, [branches, branchCode]);

    // Fetch subjects when selected branch is found
    useEffect(() => {
        if (selectedBranch) {
            dispatch(fetchSubjects(selectedBranch._id));
        }
    }, [selectedBranch]);

    // Group subjects by semester
    useEffect(() => {
        if (subjects.length) {
            const grouped = subjects.reduce((acc, subject) => {
                const { semester } = subject;
                if (!acc[semester]) {
                    acc[semester] = [];
                }
                acc[semester].push(subject);
                return acc;
            }, {});
            setGroupedSubjects(grouped);

            // Set the first semester as the default active semester
            const semesters = Object.keys(grouped).sort((a, b) => a - b);
            if (semesters.length > 0) {
                setActiveSemester(semesters[0]);
            }
        }
    }, [subjects]);

    const filteredSubjects = Object.keys(groupedSubjects).reduce(
        (acc, semester) => {
            acc[semester] = groupedSubjects[semester].filter(
                (subject) =>
                    subject.subjectName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    subject.subjectCode
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            return acc;
        },
        {}
    );

    if (subjectsLoading || coursesLoading || branchesLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (subjectsError || coursesError || branchesError) {
        return (
            <p className="text-center text-red-500">
                Error: {subjectsError || coursesError || branchesError}
            </p>
        );
    }

    if (!selectedBranch) {
        return <p className="text-center text-red-500">Branch not found!</p>;
    }

    return (
        <div className="container mx-auto p-4 ">
            <DetailPageNavbar path={`resource/${courseCode}/${branches}`} />
            <h1 className="text-2xl font-bold text-center mb-2">
                {capitalizeWords(collegeName)}: {branchCode.toUpperCase()}
            </h1>
            <h2 className="text-xs sm:text-lg text-center mb-4">
                Semester subjects or Code may vary across different colleges,
                please adjust accordingly
            </h2>

            {/* Semester Tabs */}
            <div className="flex justify-start lg:justify-center space-x-4 mb-6 overflow-x-scroll">
                {Object.keys(groupedSubjects)
                    .sort((a, b) => a - b)
                    .map((semester) => (
                        <button
                            key={semester}
                            className={`min-w-16 px-2 sm:px-4 py-2 rounded ${
                                activeSemester === semester
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            } hover:bg-blue-400 transition duration-200`}
                            onClick={() => setActiveSemester(semester)}
                        >
                            Sem {semester}
                        </button>
                    ))}
            </div>

            {/* Search Input */}
            <div className="mb-2 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by Subject Name or Code"
                    className="border border-gray-300 px-4 py-2 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Subjects Table */}
            {activeSemester && filteredSubjects[activeSemester]?.length > 0 ? (
                <div className="overflow-x-auto lg:mx-20 xl:mx-40">
                    <table className="table-auto w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-sky-500 text-white">
                            <tr>
                                <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                    Subject Name
                                </th>
                                <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                    Code
                                </th>
                                <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                    Total Notes & Pyqs
                                </th>
                                <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubjects[activeSemester].map((subject) => (
                                <tr
                                    key={subject._id}
                                    className="hover:bg-gray-100"
                                >
                                    <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                        {subject.subjectName}
                                    </td>
                                    <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                        {subject.subjectCode}
                                    </td>
                                    <td className="border border-gray-300 px-2 text-xs sm:text-lg  sm:px-4 py-2">
                                        100
                                    </td>
                                    <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-center">
                                        <Link
                                            to={`notes/${subject.subjectCode.toLowerCase()}`}
                                            state={{ subjectId: subject._id }}
                                            className="px-1 sm:px-3 py-1 bg-sky-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
                                            aria-label={`View Notes for ${subject.subjectName}`}
                                        >
                                            Notes
                                        </Link>
                                        <Link
                                            to={`pyqs/${subject.subjectCode.toLowerCase()}`}
                                            state={{ subjectId: subject._id }}
                                            className="px-1 sm:px-3 py-1 bg-sky-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
                                            aria-label={`View PYQs for ${subject.subjectName}`}
                                        >
                                            Pyqs
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600">
                    No subjects available for Semester {activeSemester}.
                </p>
            )}
        </div>
    );
}

export default Subjects;
