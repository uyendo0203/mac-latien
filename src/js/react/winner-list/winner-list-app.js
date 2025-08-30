import React, { useState, useEffect } from "react";
import { baseUrl } from "../react-config"; // Import baseUrl from apiUrl.js

const WinnerList = () => {
    const [searchCode, setSearchCode] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [modalActive, setModalActive] = useState(false);
    const [batchList, setBatchList] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [winnerList, setWinnerList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataSearch, setDataSearch] = useState();

    // Thêm hàm show/hide loading
    const showLoading = () => {
        const loading = document.querySelector(".loading");
        if (loading) loading.classList.add("show");
    };
    const hideLoading = () => {
        const loading = document.querySelector(".loading");
        if (loading) loading.classList.remove("show");
    };

    // Call API lấy danh sách đợt
    useEffect(() => {
        showLoading();
        fetch(`${baseUrl}/api/batch-list`)
            .then((res) => res.json())
            .then((res) => {
                if (res.data) setBatchList(res.data);
            })
            .catch(() => setBatchList([]))
            .finally(() => hideLoading());
    }, []);

    // Gọi API lấy danh sách trúng thưởng theo batch và page
    useEffect(() => {
        if (!selectedBatch) return;
        showLoading();
        fetch(
            `${baseUrl}/api/winners?batch_list=${selectedBatch}&per_page=10&page=${currentPage}`
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.data) setWinnerList(res.data);
                else setWinnerList([]);
                setTotalPages(res.last_page || 1);
            })
            .catch(() => {
                setWinnerList([]);
                setTotalPages(1);
            })
            .finally(() => hideLoading());
    }, [selectedBatch, currentPage]);

    const closeModal = () => setModalActive(false);

    const handleModalClick = (e) => {
        if (e.target.classList.contains("modal-winner")) {
            setModalActive(false);
        }
    };

    // Set default value for the first item in batchList
    useEffect(() => {
        if (batchList.length > 0 && !selectedBatch) {
            setSelectedBatch(batchList[0].key);
        }
    }, [batchList, selectedBatch]);

    // Reset page về 1 khi đổi batch
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBatch]);

    const handleSearch = (type) => {
         let params = new URLSearchParams();

        if (type === 'phone' && searchPhone) {
            params.append("phone", searchPhone);
        } else {
            params.append("code", searchCode);
        }

        showLoading();
        fetch(`${baseUrl}/api/minigames/search?${params.toString()}`)
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setDataSearch(res);
                    setModalActive(true);
                } else {
                    setDataSearch(null);
                    setModalActive(false);
                }
            })
            .catch(() => {
                setDataSearch(null);
                setModalActive(false);
            })
            .finally(() => hideLoading());
    };

    // Hàm tạo mảng số trang hiển thị: 3 đầu, 3 cuối, ở giữa là ...
    const getPagination = (total, current) => {
        const pages = new Set();

        // Luôn thêm 2 trang đầu và cuối
        pages.add(1);
        if (total > 1) pages.add(2);
        if (total > 2) pages.add(total - 1);
        if (total > 1) pages.add(total);

        // Thêm current -1, current, current +1 nếu nằm trong khoảng hợp lệ
        for (let i = current - 1; i <= current + 1; i++) {
            if (i > 0 && i <= total) {
                pages.add(i);
            }
        }

        // Chuyển sang mảng, sắp xếp tăng dần
        const sorted = Array.from(pages).sort((a, b) => a - b);

        // Chèn dấu "..." nếu cần
        const result = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                result.push("...");
            }
            result.push(sorted[i]);
        }

        return result;
    };

    // Determine modal-body class based on number of prizes
    const getModalBodyClass = () => {
        if (Array.isArray(dataSearch?.prizes)) {
            if (dataSearch.prizes.length === 2) return "modal-body two-items";
            if (dataSearch.prizes.length === 1) return "modal-body one-item";
        }
        switch (dataSearch?.prizes) {
            case 1:
                return "modal-body one-item";
                break;
            case 2:
                return "modal-body two-items";
                break;
            case 3:
                return "modal-body three-items";
                break;
            default:
                return "modal-body four-items";
                break;
        }
    };

    const maskPhone = (phone) => {
        if (typeof phone !== "string") phone = String(phone);
        if (phone.length <= 2) return "**";
        return phone.slice(0, -2) + "**";
    };

    return (
        <div className="winner-list">
            <div className="container">
                <div
                    id="modal-winner"
                    className={`modal modal-winner ${
                        modalActive ? "active" : "inactive"
                    }`}
                    onMouseDown={handleModalClick}
                >
                    <div className="modal-content">
                        <div className="modal-bg"></div>
                        {Array.isArray(dataSearch?.prizes) &&
                        dataSearch.prizes.length > 0 ? (
                            <div className="modal-wrapper success">
                                <img
                                    className="img-firework"
                                    src="./images/winner-firework.png"
                                    alt="Close"
                                />

                                <div className="modal-title">

                                    {
                                        dataSearch?.code || dataSearch?.code != '' ? (
                                            <p className="text-top">
                                                Mã dự thưởng{" "}
                                                <span className="font-bold">
                                                    {dataSearch.code}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="text-top">
                                                Số điện thoại{" "}
                                                <span className="font-bold">
                                                    {dataSearch?.phone}
                                                </span>
                                            </p>
                                        )
                                    }

                                    <p className="text-bottom">
                                        Đã trúng thưởng{" "}
                                    </p>
                                </div>
                                <div className={getModalBodyClass()}>
                                    {dataSearch.prizes.map((prize, idx) => (
                                        <div className="modal-item" key={idx}>
                                            <img
                                                className="modal-item--image"
                                                src={
                                                    prize.type === 1
                                                        ? "./images/winner-xemay.png"
                                                        : prize.type === 2
                                                        ? "./images/winner-nhan.png"
                                                        : prize.type === 3
                                                        ? "./images/winner-20k.png"
                                                        : "./images/winner-10k.png"
                                                }
                                                alt="Trúng thưởng"
                                            />
                                            <div className="modal-item--text">
                                                <span className="top">
                                                    <b className="bold">
                                                        {prize.name}
                                                    </b>
                                                </span>
                                                <span className="bottom">
                                                    {prize.quantity
                                                        ? prize.quantity < 10
                                                            ? `0${prize.quantity}`
                                                            : prize.quantity
                                                        : "01"}{" "}
                                                    giải
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="modal-wrapper fail">
                                <img
                                    src="./images/sample/no-reward.png"
                                    alt="no-reward"
                                />
                                <div className="modal-fail">
                                    Chúc bà con may mắn lần sau!
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="winner-list__header">
                    <div
                        className="winner-list__title"
                        data-aos="fade-up"
                        data-aos-duration="800"
                    >
                        <h2>BẢNG VÀNG THẮNG LỚN</h2>
                        <img src="./images/winner-bg-top.png" alt="Logo" />
                    </div>
                </div>

                <div className="winner-list__body">
                    <div
                        className="winner-list__desc"
                        data-aos="fade-up"
                        data-aos-duration="1200"
                    >
                        <p>
                            Chúc mừng bà con đã may mắn <span className="text-[red]"> trúng thưởng</span> trong chương trình Mùa Vàng Thắng Lớn 2025. <br/> Danh sách dưới đây sẽ được cập nhật liên tục sau mỗi đợt quay số.
                        </p>
                        <p className="text-[red]">
                            Bà con nhanh nhanh mua NPK Cà Mau, khui bao quét mã QRcode tham gia Mùa Vàng Thắng Lớn 2025 để có cơ hội trúng những giải thưởng giá trị nha!
                        </p>
                    </div>

                    <div
                        className="winner-list__search"
                        data-aos="fade-up"
                        data-aos-duration="1500"
                    >
                        <div className="winner-list__search-item">
                            <input
                                type="text"
                                placeholder="Nhập mã số"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch('code')
                                }
                            />
                            <figure
                                className="winner-list__search-icon"
                                onClick={()=>handleSearch('code')}
                            >
                                <img
                                    src="./images/winner-btn-bg-search-code.png"
                                    alt="Search Icon"
                                />
                            </figure>
                        </div>
                        <div className="winner-list__search-item">
                            <input
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={searchPhone}
                                onChange={(e) => setSearchPhone(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch('phone')
                                }
                            />
                            <figure
                                className="winner-list__search-icon"
                                onClick={()=>handleSearch('phone')}
                            >
                                <img
                                    src="./images/winner-btn-bg-search-phone.png"
                                    alt="Search Icon"
                                />
                            </figure>
                        </div>
                    </div>

                    <div
                        className="winner-list__wrap-title"
                        data-aos="fade-up"
                        data-aos-duration="1800"
                    >
                        <h3 className="winner-list__table-title">
                            DANH SÁCH TRÚNG THƯỞNG{" "}
                        </h3>
                        <div className="winner-list__select">
                            <select
                                value={selectedBatch}
                                onChange={(e) =>
                                    setSelectedBatch(e.target.value)
                                }
                            >
                                {batchList.map((batch) => (
                                    <option key={batch.key} value={batch.key}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div
                        className="winner-list__table-wrap"
                        data-aos="fade-up"
                        data-aos-duration="2000"
                    >
                        <table className="winner-list__table">
                            <thead className="winner-list__wrap-header">
                                <tr className="winner-list__row">
                                    <th className="winner-list__col">STT</th>
                                    <th className="winner-list__col">
                                        Mã dự thưởng
                                    </th>
                                    <th className="winner-list__col">
                                        Họ và tên
                                    </th>
                                    <th className="winner-list__col">
                                        Số điện thoại
                                    </th>
                                    <th className="winner-list__col">
                                        Giải thưởng
                                    </th>
                                    <th className="winner-list__col">
                                        Khu vực
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="winner-list__wrap-body">
                                {winnerList.map((item, index) => (
                                    <tr
                                        className="winner-list__row"
                                        key={item.id || index}
                                    >
                                        <td className="winner-list__col">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td className="winner-list__col">
                                            {item.code}
                                        </td>
                                        <td className="winner-list__col">
                                            {item.name}
                                        </td>
                                        <td className="winner-list__col">
                                            {maskPhone(item.phone)}
                                        </td>
                                        <td className="winner-list__col">
                                            {item.prize}
                                        </td>
                                        <td className="winner-list__col">
                                            {item.address || item.area}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="winner-list__pagination">
                            {getPagination(totalPages, currentPage).map(
                                (page, idx) =>
                                    page === "..." ? (
                                        <span
                                            key={`dots-${idx}`}
                                            className="dots"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={`page-${page}`}
                                            className={`page${
                                                currentPage === page
                                                    ? " active"
                                                    : ""
                                            }`}
                                            onClick={() => setCurrentPage(page)}
                                            disabled={currentPage === page}
                                        >
                                            {page}
                                        </button>
                                    )
                            )}
                        </div>
                    )}
                </div>

                <div className="winner-list__bg-bottom">
                    <img
                        src="./images/winner-bottom-line.png"
                        alt="Background"
                    />
                </div>
            </div>
        </div>
    );
};
export default WinnerList;
