import { star } from "../../../public/assets";

const ReviewCard = ({ imgURL, customerName, rating, feedback }) => {
  return (
    <div className="flex flex-col justify-center items-center my-10 ">
      <img
        src={imgURL}
        alt={customerName}
        className=" w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full object-cover  "
      />
      <h3 className="mt-4 font-palanquin text-xl md:text-2xl text-center font-bold ">
        {customerName}
      </h3>
      <p className="info-text text-center mt-2 max-w-sm text-md">{feedback}</p>
      <div className="mt-3 flex justify-center items-center gap-2.5 ">
        <img
          src={star}
          alt="star"
          width={24}
          height={24}
          className="object-contain m-0"
        />
        <p className="text-lg md:text-xl font-montserrat text-slate-gray">
          {" "}
          ({rating}){" "}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
