import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import EditSeniorModal from '../components/SeniorModal/EditSeniorModal';
import SeniorDetailModal from '../components/SeniorModal/SeniorDetailModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { api } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest.js';
import useApiFetch from '../hooks/useApiFetch.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import SeniorCard from '../components/Cards/SeniorCard.jsx';

const SeniorPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [seniors, setSeniors] = useState([]);
    const [editingSenior, setEditingSenior] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [loadingStates, setLoadingStates] = useState({
        editSenior: {},
        deleteSenior: {},
    });

    const { apiRequest, loading } = useApiRequest();
    const { useFetch, loadingFetch } = useApiFetch();

    const url = api.senior;

    const fetchSeniors = async () => {
        try {
            const data = await useFetch(`${url}/college/${collegeId}`);
            setSeniors(data);
        } catch (err) {
            console.error('Error fetching seniors:', err);
            toast.error('Error fetching seniors ');
        }
    };

    const handleEdit = (senior) => {
        setEditingSenior(senior);
        setIsEditModalOpen(true);
    };

    const handleDetail = (senior) => {
        setSelectedSenior(senior);
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (seniorId) => {
        setLoadingStates((prev) => ({
            ...prev,
            deleteSenior: { ...prev.deleteSenior, [seniorId]: true },
        }));
        try {
            await apiRequest(`${url}/${seniorId}`, 'DELETE');
            fetchSeniors();
            toast.success('Senior deleted successfully!');
        } catch (err) {
            console.error('Error deleting senior:', err);
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                deleteSenior: { ...prev.deleteSenior, [seniorId]: false },
            }));
        }
    };

    useEffect(() => {
        fetchSeniors();
    }, []);

    // Filter seniors based on selected course
    const filteredSeniors = useMemo(() => {
        return seniors.filter(
            (senior) =>
                (selectedCourse ? senior.branch === selectedCourse : true) &&
                (selectedYear ? senior.year === selectedYear : true)
        );
    }, [seniors, selectedCourse, selectedYear]);
    const courses = [
        ...new Set(filteredSeniors.map((senior) => senior.branch)),
    ];

    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <CollegeLinks />
            <div className="container mx-auto p-5">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="sm:text-3xl font-bold mb-2 text-center">
                        Seniors - {capitalizeWords(collegeName)}
                    </h1>
                    <p className="italic text-center text-xs sm:text-base">
                        Reach out to seniors for mentorship and expert guidance
                        on your journey
                    </p>
                    <br />
                    <div className="flex flex-wrap justify-center text-center space-x-4 mb-5">
                        <select
                            className="p-2 border rounded-md mb-2 lg:mb-0"
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                            }}
                            value={selectedYear}
                        >
                            <option value="">All Years</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                        </select>
                        <select
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                            }}
                            className="p-2 border rounded-md mb-2 lg:mb-0"
                        >
                            <option value="">All Courses</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center items-center py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6 w-full max-w-7xl">
                        {filteredSeniors.length > 0 ? (
                            <SeniorCard
                                seniors={filteredSeniors}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                loadingStates={loadingStates}
                                handleDetail={handleDetail}
                            />
                        ) : (
                            <div className="col-span-4 flex justify-center items-center py-10 w-full">
                                {loadingFetch ? (
                                    <i className="fas fa-spinner fa-pulse fa-5x"></i>
                                ) : (
                                    <p className="text-center text-gray-500 mt-5">
                                        No Senior found for the selected
                                        filters.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {isEditModalOpen && (
                    <EditSeniorModal
                        editingSenior={editingSenior}
                        handleInputChange={(e) => {
                            const { name, value, type, checked } = e.target;
                            setEditingSenior({
                                ...editingSenior,
                                [name]: type === 'checkbox' ? checked : value,
                            });
                        }}
                        handleUpdate={async (e) => {
                            e.preventDefault();

                            const payload = {
                                name: editingSenior.name,
                                branch: editingSenior.branch,
                                year: editingSenior.year,
                                domain: editingSenior.domain,
                                whatsapp: editingSenior.whatsapp,
                                telegram: editingSenior.telegram,
                                college: editingSenior.college,
                            };

                            try {
                                await apiRequest(
                                    `${url}/${editingSenior._id}`,
                                    'PUT',
                                    payload
                                );
                                toast.success('Senior updated successfully');
                                setIsEditModalOpen(false);
                                fetchSeniors();
                            } catch (err) {
                                console.error('Error updating senior:', err);
                            }
                        }}
                        loading={loading}
                        setIsModalOpen={setIsEditModalOpen}
                    />
                )}

                {isDetailModalOpen && (
                    <SeniorDetailModal
                        senior={selectedSenior}
                        setIsDetailModalOpen={setIsDetailModalOpen}
                    />
                )}
            </div>
            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

export default SeniorPage;
