import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

import ReCAPTCHA from "react-google-recaptcha";
import dataBagsResult from "./mini-game-data-bags-result.json";

import {baseUrl, siteKeyCaptcha, percentToWin, timeToBackToStartGame} from "../react-config";


/*
step: state của form-info, form-privacy, form-questions
- "intro": Hiển thị modal giới thiệu game
- "privacy": Hiển thị modal điều khoản và chính sách
- "bags": Hiển thị câu hỏi và kết quả
*/

/*
gameState state của step từng câu hỏi
- questionActive: chỉ số câu hỏi hiện tại
- selectedOption: chỉ số của lựa chọn đã chọn
- noReward: không có phần thưởng
- winner: người chơi thắng
- failure: người chơi thua
- toQuestion: chuyển sang layout câu hỏi
- selectedOption: chỉ số của lựa chọn đã chọn
- result: kết quả của game, có thể là "noReward", "winner", "failure", "toQuestion"
- questionStep: từng bước của câu hỏi, để biết đúng hay sai
*/

const defaultValues = {
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address_detail: "123 Đường ABC",
    info_agree: true,
    captcha: null, // Bạn cần tick captcha thật khi test thực tế
    privacy_agree: true, // hoặc true nếu muốn mặc định đã tick
};

const MiniGame = () => {
    const {
        watch,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
        reset,
    } = useForm({
        // defaultValues,
        mode: "onChange", // Để isValid cập nhật realtime khi nhập
    });
    const captchaValue = watch("captcha");

    const [randomNumber, setRandomNumber] = useState(0);
    const [step, setStep] = useState(["intro", ""]); // intro, info, privacy, bags
    const [dataBags, setDataBags] = useState(dataBagsResult.bags); //show 3 bags
    const [dataQuestions, setDataQuestions] = useState(); //show 3 questions
    const [dataResults, setDataResults] = useState(dataBagsResult.results);
    const [questionStep, setQuestionStep] = useState(); //từng bước của câu hỏi, để biết đúng hay sai
    const [allDataToServer, setAllDataToServer] = useState()

    const initialGameState = {
        questionActive: 0,
        selectedOption: null,
        result: null,
    };
    const [gameState, setGameState] = useState(initialGameState);
    const [isFlip, setIsFlip] = useState(false);

    // Reset all
    const resetGame = () => {
        setGameState(initialGameState); // reset trạng thái
        setQuestionStep(undefined); // reset câu hỏi hiện tại
        randomArrayQuestions(); // random lại câu hỏi
        randomArrayBags(); // random lại bags
        setStep(["intro"]) // chuyển về bước intro
        setAllDataToServer({}); // reset dữ liệu gửi lên server
        reset(); // reset form
    }

    const getRandomItems = (arr, n) =>
        [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

    //random 3 câu hỏi từ dataQuestion
    const randomArrayQuestions = () => {
        fetch(`${baseUrl}/api/minigames`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    const dataQuestionsRandom = getRandomItems(data, 3);
                    setDataQuestions(dataQuestionsRandom);
                } else {
                    console.error("Error fetching questions:", data);
                    setDataQuestions([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching questions:", err);
            });
    };

    //random 2 bags không phải key và 1 bag là key
    const randomArrayBags = () => {
        const listBagNotKey = dataBagsResult.bags.filter(
            (bag) => bag.key !== true
        );
        const randomBagsNotKey = getRandomItems(listBagNotKey, 2);
        const randomBagKeys = dataBagsResult.bags.filter(
            (bag) => bag.key === true
        );

        const bagToShow = [...randomBagsNotKey, ...randomBagKeys];

        const randomIndex = Math.floor(Math.random() * bagToShow.length);

        //thêm tag winner vào bag ngẫu nhiên
        const updatedBags = bagToShow.map((item, index) => ({
            ...item,
            winner: index === randomIndex,
        }));

        setDataBags(updatedBags);
    };

    useEffect(() => {
        randomArrayBags();
        randomArrayQuestions();
    }, []);

    // Hàm kiểm tra step đang active
    const isStepActive = (name) => Array.isArray(step) && step.includes(name);
    
    const checkPhoneExist = async (phone) => {
        try {
            const res = await fetch(`${baseUrl}/api/phone-exists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            // API trả về { exists: true/false }
            return data;
        } catch (err) {
            return false; // hoặc xử lý lỗi tùy ý
        }
    };

    const [showToast, setShowToast] = useState({
        isShow: false,
        message: "",
    });

    // Hàm hiển thị toast và tự ẩn sau 5s
    const toastNotification = ({ isShow, message, time }) => {
        setShowToast({ isShow, message });
        if (isShow) {
            setTimeout(() => {
                setShowToast({ isShow: false, message: "" });
            }, time);
        }
    };

    // handle Submit Form Info
    const onSubmitFormInfo = async (data) => {
        
        // Tìm name theo id
        const regionObj = areaData.find((item) => item.id === parseInt(data.region));
        const provinceObj = provincesData.find((item) => item.id === parseInt(data.province));
        const districtObj = districts.find((item) => item.id === parseInt(data.district));
        const wardObj = wards.find((item) => item.id === (parseInt(data.ward)));


        const regionName = regionObj ? regionObj.name : "";
        const provinceName = provinceObj ? provinceObj.name : "";
        const districtName = districtObj ? districtObj.name : "";
        const wardName = wardObj ? wardObj.name : "";

        const exists = await checkPhoneExist(data.phone);

        if (exists && exists.status == false) {
            toastNotification({
                isShow: true,
                message: exists.message,
                time: 0,
            });

            const temp = {
                phone: data.phone,
                name: data.name,
                area: regionName,
                province: provinceName,
                district: districtName,
                ward: wardName,
                address: data.address_detail,
                play_win: 0,
            }

            setAllDataToServer(temp);

            reset();
            setStep(["privacy"]);
        } else {
            toastNotification({
                isShow: true,
                message: "Số điện thoại đã tồn tại!",
                time: 4000,
            });
        }
    };

    // handle Submit Privacy
    const onSubmitFormInfoFormPrivacy = (data) => {

        // console.log("Form Privacy Data:", data);

        // Reset form nếu muốn
        // Khi submit form privacy, chỉ gi
        setStep(["bags"]);
    };

    // Select câu trả lời
    const chooseAnswerQuestion = (id, index) => {
        setGameState({
            ...gameState,
            selectedOption: index,
        });

        const currentQuestion = dataQuestions[gameState.questionActive];
        const isCorrect = currentQuestion.answers.some(
            (answer) => answer.id === id && answer.isCorrect
        );

        setQuestionStep({
            isCorrect: isCorrect,
            currentQuestion: currentQuestion,
        });
    };

    // submit câu hỏi và lưu kết quả
    const submitAnswerQuestion = () => {
        if (questionStep.isCorrect) {
            // nếu trả lời đúng
            if (gameState.questionActive < dataQuestions.length - 1) {
                // nếu chưa hết câu hỏi
                // console.log("-> Trả lời đúng, chuyển sang câu hỏi tiếp theo");
                setGameState({
                    ...gameState,
                    questionActive: gameState.questionActive + 1,
                    selectedOption: null,
                    result: "toQuestion",
                });
            } else {
                // nếu đã hết câu hỏi
                // console.log("-> Trả lời đúng, kết thúc game");
                setGameState({
                    ...gameState,
                    result: "winner",
                });
               
            }
        } else {
            // console.log("-> Trả lời sai");
            setGameState({
                ...gameState,
                result: "failure",
            });
           
        }
    };

    // select bag
    const [selectedBagIndex, setSelectedBagIndex] = useState(null);

    const selectBag = async (bag, index) => {
        setSelectedBagIndex(index);

        setIsFlip(true); // Bắt đầu animation lật bao

        // Đợi 1s cho animation
        setTimeout(async () => {
            // setSelectedBagIndex(null); // reset lại sau animation

            let loadingTimeout;
            let loadingShown = false;

            loadingTimeout = setTimeout(() => {
                showLoading();
                loadingShown = true;
            }, 1000);

            const res = await fetch(`${baseUrl}/api/total-month-prize`);
            const data = await res.json();

            if (data.total > 0) {
                clearTimeout(loadingTimeout);
                if (loadingShown) hideLoading();

                const randomChance = Math.random();
                setRandomNumber(randomChance);

                if (bag.winner === true) {
                    if (randomChance <= percentToWin) {
                        setGameState({
                            ...initialGameState,
                            result: "toQuestion",
                        });
                    } else {
                        setGameState({
                            ...initialGameState,
                            result: "noReward",
                        });
                    }
                } else {
                    setGameState({
                        ...initialGameState,
                        result: "noReward",
                    });
                }
            } else {
                clearTimeout(loadingTimeout);
                if (loadingShown) hideLoading();
                setGameState({
                    ...initialGameState,
                    result: "noReward",
                });
            }
        }, 1000); // 1s animation
    };

    useEffect(() => {
        // console.log("Game State Updated:", gameState);

        const submitGameResult = async () => {
            const dataToServer = {
                ...allDataToServer,
                play_win: gameState.result === "winner" ? 1 : 0,
            };

            // console.log({ dataToServer });

            try {
                const res = await fetch(`${baseUrl}/api/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToServer),
                });

                const data = await res.json();

                if (data.status === true) {
                    setTimeout(() => {
                        resetGame(); // Reset game sau khi gửi thành công
                    }, timeToBackToStartGame);
                }

            } catch (err) {
                console.error("Lỗi gửi dữ liệu:", err);
            }
        };

        // Gọi chỉ khi result là 1 trong các trạng thái đã chơi
        if (["winner", "noReward", "failure"].includes(gameState.result)) {
            submitGameResult();
        }
    }, [gameState]);


    // Thêm hàm handle click outside modal
    const handleModalIntroClick = (e) => {
        setStep(["info"])
    };

    // State cho khu vực
    const [areaData, setAreaData] = useState([]);
    const [provincesData, setProvincesData] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Fetch region data từ API khi component mount
    useEffect(() => {
        fetch(`${baseUrl}/api/areas`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    setAreaData(data.data);
                }
            })
            .catch((err) => setAreaData([]));
    }, []);

    // Khi chọn khu vực (region/area), gọi API lấy danh sách tỉnh/thành phố
    const region = watch("region");
    useEffect(() => {
        if (region) {
            fetch(`${baseUrl}/api/provinces/${region}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        setProvincesData(data.data);
                    } else {
                        setProvincesData([]);
                    }
                })
                .catch(() => setProvincesData([]));
            setValue("province", "");
            setValue("district", "");
            setValue("ward", "");
        } else {
            setProvincesData([]);
            setDistricts([]);
            setWards([]);
            setValue("province", "");
            setValue("district", "");
            setValue("ward", "");
        }
    }, [region, setValue]);

    // Khi chọn tỉnh, chỉ gọi API nếu đã chọn region
    const province = watch("province");
    useEffect(() => {
        if (province && region) {
            fetch(`${baseUrl}/api/districts/${province}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        setDistricts(data.data);
                    } else {
                        setDistricts([]);
                    }
                })
                .catch(() => setDistricts([]));
            setValue("district", "");
            setValue("ward", "");
            setWards([]);
        } else {
            setDistricts([]);
            setWards([]);
            setValue("district", "");
            setValue("ward", "");
        }
    }, [province, region, setValue]);

    // Khi chọn quận/huyện, chỉ gọi API nếu đã chọn province và region
    const district = watch("district");
    useEffect(() => {
        if (district && province && region) {
            fetch(`${baseUrl}/api/wards/${district}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        setWards(data.data);
                    } else {
                        setWards([]);
                    }
                })
                .catch(() => setWards([]));
            setValue("ward", "");
        } else {
            setWards([]);
            setValue("ward", "");
        }
    }, [district, province, region, setValue]);

    const values = watch();
    // useEffect(() => {
    //     console.log("Form values:", values);
    //     console.log("Form isValid:", isValid);
    //     console.log("Errors:", errors);
    // }, [values, isValid, errors]);

      // useEffect(() => {
    //     console.log({ gameState });
    // }, [gameState]);

    // useEffect(() => {
    //     console.log({ step });
    // }, [step]);

    // useEffect(() => {
    //     console.log({allDataToServer });
    // },[allDataToServer]);


    const ReloadPage = () => {
        window.location.reload();
    };

    // Get Content Policy from HTML element id="policy-terms"
    const [policyContent, setPolicyContent] = useState("");

    useEffect(() => {
        // Lấy nội dung từ #policy-terms nếu có
        const el = document.getElementById("policy-terms");
        
        if (el) setPolicyContent(DOMPurify.sanitize(el.innerText));
    }, []);

    return (
        <>
            <div
                id="toast-minigame"
                className={`toast ${showToast.isShow ? "active" : ""}`}
                role="alert"
            >
                <img
                    className="max-w-[2rem]"
                    src="./images/favicon.png"
                    alt="Icon"
                />
                <div className="text">{showToast.message}</div>
                <div
                    className="icon rotate-[45deg] "
                    data-dismiss-target="#toast-success"
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg
                        className="close "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </div>
            </div>

            {isStepActive("info") ? (
                <h2 className="mini-game__title">Điền thông tin</h2>
            ) : isStepActive("intro") ? (
                ""
            ) : (
                <figure
                    className={`mini-game__title-image ${
                        gameState.result === "winner" ? "hidden" : ""
                    }`}
                >
                    <img
                        src="./images/mini-game-select-bag-heading.png"
                        alt="Mini Game Title"
                    />
                </figure>
            )}

            <div
                className={`mini-game step-${step[0]} ${
                    gameState.result === "winner" ? "game-winner" : ""
                }`}
            >
                <div className="container">
                    {/* <button
                        onClick={() => ReloadPage()}
                        type="submit"
                        className=" absolute w-[150px] bottom-[-30px] left-[50%] translate-x-[-50%] bg-yellow py-2 px-4 z-[999] btn-continue"
                    >
                        Reload
                    </button> */}

                    <div
                        className={`mini-game__wrapper${
                            isStepActive("bags") ? " show-latbao" : ""
                        }`}
                    >
                        {/* form info  */}
                        {isStepActive("info") && (
                            <form
                                name="form-info"
                                className={`mini-game__step mini-game__form-info${isStepActive("info") ? " fade-in" : ""}${isStepActive("info") ? "" : " inactive"}`}
                                onSubmit={handleSubmit(onSubmitFormInfo)}
                                noValidate
                            >
                                <div className="form-wrap">
                                    <div className="form-field">
                                        <input
                                            type="text"
                                            placeholder="Họ & tên"
                                            {...register("name", {
                                                required:
                                                    "Vui lòng nhập họ tên",
                                            })}
                                            className={`form-input ${
                                                errors.name ? "error" : ""
                                            }`}
                                        />
                                        {errors.name && (
                                            <div className="form-error col-span-2">
                                                {errors.name.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <input
                                            type="tel"
                                            placeholder="Số điện thoại"
                                            {...register("phone", {
                                                required:
                                                    "Vui lòng nhập số điện thoại",
                                                pattern: {
                                                    value: /^[0-9]{10,11}$/,
                                                    message:
                                                        "Số điện thoại chỉ gồm số và tối đa 11 số",
                                                },
                                                maxLength: {
                                                    value: 11,
                                                    message:
                                                        "Số điện thoại tối đa 11 số",
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message:
                                                        "Số điện thoại tối thiểu 10 số",
                                                },
                                            })}
                                            className={`form-input ${
                                                errors.phone ? "error" : ""
                                            }`}
                                        />
                                        {errors.phone && (
                                            <div className="form-error col-span-2">
                                                {errors.phone.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <select
                                            required
                                            {...register("region", {
                                                required:
                                                    "Vui lòng chọn khu vực",
                                            })}
                                            className={`form-input ${
                                                errors.region ? "error" : ""
                                            }`}
                                        >
                                            <option value="" hidden>
                                                Khu vực
                                            </option>
                                            {areaData.map((p) => (
                                                <option
                                                    key={p.name}
                                                    value={p.id}
                                                >
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.region && (
                                            <div className="form-error col-span-2">
                                                {errors.region.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <select
                                            required
                                            {...register("province", {
                                                required:
                                                    "Vui lòng chọn tỉnh/thành phố",
                                            })}
                                            className={`form-input ${
                                                errors.province ? "error" : ""
                                            }`}
                                            disabled={!provincesData.length}
                                        >
                                            <option value="" hidden>
                                                Tỉnh/Thành phố
                                            </option>
                                            {provincesData.map((p) => (
                                                <option
                                                    key={p.name}
                                                    value={p.id}
                                                >
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.province && (
                                            <div className="form-error col-span-2">
                                                {errors.province.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <select
                                            required
                                            {...register("district", {
                                                required:
                                                    "Vui lòng chọn quận/huyện",
                                            })}
                                            className={`form-input ${
                                                errors.district ? "error" : ""
                                            }`}
                                            disabled={!districts.length}
                                        >
                                            <option value="" hidden>
                                                Quận/Huyện
                                            </option>
                                            {districts.map((d) => (
                                                <option
                                                    key={d.name}
                                                    value={d.id}
                                                >
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.district && (
                                            <div className="form-error col-span-2">
                                                {errors.district.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <select
                                            required
                                            {...register("ward", {
                                                required:
                                                    "Vui lòng chọn phường/xã",
                                            })}
                                            className={`form-input ${
                                                errors.ward ? "error" : ""
                                            }`}
                                            disabled={!wards.length}
                                        >
                                            <option value="" hidden>
                                                Phường xã
                                            </option>
                                            {wards.map((w) => (
                                                <option
                                                    key={w.id + w.name}
                                                    value={w.id}
                                                >
                                                    {w.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ward && (
                                            <div className="form-error col-span-2">
                                                {errors.ward.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <input
                                            type="text"
                                            placeholder="Số nhà - thôn/xóm/ấp/làng"
                                            {...register("address_detail", {
                                                required:
                                                    "Vui lòng nhập địa chỉ",
                                            })}
                                            className={`form-input col-span-2 ${
                                                errors.address_detail
                                                    ? "error"
                                                    : ""
                                            }`}
                                        />
                                        {errors.address_detail && (
                                            <div className="form-error col-span-2">
                                                {errors.address_detail.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="checkbox-agree">
                                    <label>
                                        <input
                                            className="custom-checkbox"
                                            type="checkbox"
                                            {...register("info_agree", {
                                                required:
                                                    "Bạn cần đồng ý với chính sách",
                                            })}
                                        />
                                        <span>
                                            Tôi đồng ý với việc thu thập và sử
                                            dụng thông tin theo Chính sách bảo
                                            mật của Phân Bón Cà Mau
                                        </span>
                                    </label>
                                    {errors.info_agree && (
                                        <div className="form-error">
                                            {errors.info_agree.message}
                                        </div>
                                    )}
                                </div>

                                <div className="form-field form-captcha">
                                    <ReCAPTCHA
                                        className="captcha"
                                        sitekey={siteKeyCaptcha}
                                        onChange={(value) =>
                                            setValue("captcha", value, {
                                                shouldValidate: true,
                                            })
                                        }
                                    />
                                    <input
                                        type="hidden"
                                        {...register("captcha", {
                                            required:
                                                "Vui lòng xác nhận captcha",
                                        })}
                                    />
                                    {errors.captcha && (
                                        <div className="form-error">
                                            {errors.captcha.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn-continue"
                                    disabled={!isValid}
                                >
                                    Tiếp tục
                                </button>
                            </form>
                        )}

                        {/* form privacy */}
                        {isStepActive("privacy") && (
                            <div
                                name="form-privacy"
                                className={`mini-game__step mini-game__privacy${isStepActive("privacy") ? " fade-in" : ""}${isStepActive("privacy") ? "" : " inactive"}`}
                            >
                                <h4 className="heading">
                                    Điều khoản & chính sách
                                </h4>
                                <div className="text">
                                    {parse(policyContent)}
                                </div>
                                <form
                                    className="mini-game__form-privacy"
                                    onSubmit={handleSubmit(
                                        onSubmitFormInfoFormPrivacy
                                    )}
                                >
                                    <div className="checkbox-agree">
                                        <label>
                                            <input
                                                className="custom-checkbox"
                                                type="checkbox"
                                                {...register("privacy_agree", {
                                                    required:
                                                        "Bạn cần đồng ý với chính sách",
                                                })}
                                            />
                                            <span>
                                                Tôi đồng ý với các điều khoản
                                                trên.{" "}
                                            </span>
                                        </label>
                                        {errors.privacy_agree && (
                                            <div className="form-error">
                                                {errors.privacy_agree.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <button
                                            disabled={!isValid}
                                            type="submit"
                                            className="btn-continue"
                                        >
                                            Chơi game
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* form bags */}
                        {isStepActive("bags") && (
                            <div
                                name="form-questions"
                                className={`mini-game__step mini-game__bags${isStepActive("bags") ? " fade-in" : ""}${isStepActive("bags") ? "" : " inactive"}`}
                            >
                                <div
                                    className={`step-bags ${
                                        gameState.result != null
                                            ? "inactive"
                                            : ""
                                    }`}
                                >
                                    <h3 className="step-bags__title">
                                        Lật bao để khám phá điều bất ngờ
                                    </h3>
                                    <div className="step-bags__list">
                                        {dataBags &&
                                            dataBags.map((item, index) => (
                                                <div
                                                    key={index}
                                                    // className={`step-bags__bag ${selectedBagIndex === index ? " bag-selected-animate" : ""}`}
                                                    className={`step-bags__bag`}
                                                    onClick={() => selectBag(item, index)}
                                                >
                                                    <div className={`card ${selectedBagIndex === index &&'flipped'}`}>
                                                        <figure
                                                            className={`step-bags__image front`}
                                                            // className={`step-bags__image front ${
                                                            //     item.winner
                                                            //         ? "border border-[red] border-solid"
                                                            //         : ""
                                                            // }`}
                                                        >
                                                            <img
                                                                src={`./images/${item.image}`}
                                                                alt={item.name}
                                                            />
                                                        </figure>
                                                        <figure
                                                            className={`step-bags__image back`}
                                                        >
                                                            <img
                                                                src={`./images/${item.image}`}
                                                                alt={item.name}
                                                            />
                                                        </figure>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* <h2> Tỉ lệ: {Math.round(randomNumber * 100) / 100}</h2> */}

                                {gameState.result == "toQuestion" && (
                                    <div className="step-question">
                                        <h3 className="step-question__title">
                                            Trả lời câu hỏi để nhận quà
                                        </h3>
                                        {dataQuestions &&
                                            dataQuestions.map(
                                                (question, index) =>
                                                    gameState.questionActive ===
                                                    index ? (
                                                        <div
                                                            key={index}
                                                            className={`step-question__item active animate-question`}
                                                        >
                                                            <label className="step-question__label">
                                                                Câu: {index + 1}{" "}
                                                                :{" "}
                                                                {question.text}
                                                            </label>
                                                            <div className="step-question__select">
                                                                {question.answers.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className={`step-question__option ${
                                                                                gameState.selectedOption ===
                                                                                index
                                                                                    ? "selected"
                                                                                    : ""
                                                                            }`}
                                                                            onClick={() =>
                                                                                chooseAnswerQuestion(
                                                                                    item.id,
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="step-question__type">
                                                                                {
                                                                                    item.type
                                                                                }
                                                                            </div>
                                                                            <div className="step-question__text">
                                                                                {
                                                                                    item.text
                                                                                }{" "}
                                                                                -{" "}
                                                                                {item.isCorrect
                                                                                    ? "Đúng"
                                                                                    : "Sai"}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <div className="step-question__submit">
                                                                <button
                                                                    disabled={
                                                                        gameState.selectedOption ==
                                                                        null
                                                                            ? "disabled"
                                                                            : ""
                                                                    }
                                                                    className="btn-continue"
                                                                    onClick={() =>
                                                                        submitAnswerQuestion()
                                                                    }
                                                                >
                                                                    Tiếp tục
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )
                                            )}
                                    </div>
                                )}

                                <div className="step-results">
                                    {gameState.result == "winner" && (
                                        <div className="step-results__item winner animate-fade-slide-in">
                                            <h3 className="step-results__heading">
                                                Số điện thoại{" "}
                                                <span className="phone">
                                                    {dataResults.winner.phone}
                                                </span>
                                            </h3>
                                            <div className="step-results__image">
                                                <img
                                                    src={`./images/${dataResults.winner.image}`}
                                                    alt="Kết quả"
                                                />
                                            </div>
                                            <div className="step-results__title">
                                                <div className="top">
                                                    {
                                                        dataResults.winner
                                                            .text_top
                                                    }
                                                </div>
                                                <div className="center">
                                                    {
                                                        dataResults.winner
                                                            .text_center
                                                    }
                                                </div>
                                                <div className="bottom">
                                                    {
                                                        dataResults.winner
                                                            .text_bottom
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {gameState.result == "failure" && (
                                        <div className="step-results__item failure animate-fade-slide-in">
                                            <div className="step-results__image">
                                                <img
                                                    src={`./images/sample/${dataResults.failure.image}`}
                                                    alt="Kết quả"
                                                />
                                            </div>
                                            <h3 className="step-results__title">
                                                <div className="bottom">
                                                    {
                                                        dataResults.failure
                                                            .text_top
                                                    }
                                                </div>
                                                <div className="top">
                                                    {
                                                        dataResults.failure
                                                            .text_bottom
                                                    }
                                                </div>
                                            </h3>
                                        </div>
                                    )}
                                    {gameState.result == "noReward" && (
                                        <div className="step-results__item no-reward animate-fade-slide-in">
                                            <div className="step-results__image">
                                                <img
                                                    src={`./images/sample/${dataResults.noreward.image}`}
                                                    alt="Kết quả"
                                                />
                                            </div>
                                            <h3 className="step-results__title">
                                                <div className="top">
                                                    {
                                                        dataResults.noreward
                                                            .text_top
                                                    }
                                                </div>
                                                <div className="bottom">
                                                    {
                                                        dataResults.noreward
                                                            .text_bottom
                                                    }
                                                </div>
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div id="modal-exist-phone" className="modal inactive">
                <div className="modal-content">
                    <p>Số điện thoại đã có trong hệ thống</p>
                    <button className="modal-button">Đóng</button>
                </div>
            </div>

            <div
                id="modal-mini-game-intro"
                className={`mini-game__intro ${
                    isStepActive("intro") ? "": "inactive"
                }`}
            >
                <div className="container">
                    <div className="modal-content">
                        <div className="modal-center">
                            <figure className="item-center">
                                <img
                                    src="./images/minigame-popup-img.png"
                                    alt="Giới thiệu mini game"
                                />
                            </figure>

                            <figure className="item-20k">
                                <img
                                    src="./images/minigame-popup-20k.png"
                                    alt="Giới thiệu mini game"
                                />
                            </figure>

                            <div className="modal-button">
                                <button
                                    className="modal-button-click"
                                    onClick={handleModalIntroClick}
                                >
                                    Chơi game
                                </button>
                            </div>
                        </div>
                        <div className="modal-des">
                            Thời gian diễn ra: từ đây đến hết tháng 2/2026
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MiniGame;
