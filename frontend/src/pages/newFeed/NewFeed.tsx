import React, { useEffect, useState } from "react";
import styles from "./NewFeed.module.css";
import css from "../detailCourt/DetailCourt.module.css";
import { useSelector, useDispatch } from "react-redux";
import SearchBox from "../../components/mapbox/SearchBox";
import { useNavigate, useOutletContext } from "react-router-dom";
import { pages } from "../../router";
import { createPost, fetchPosts, fetchSearchCourt, setCourtModal } from "./NewFeed.duck";
import { AppDispatch } from "../../redux/store";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import { getIcon, getImageCourt, iconsName } from "../../util/getAssets";
import text from "../../util/text";
import dayjs from "dayjs";
import Title from "../../components/titles/Title";
import navigateToPage from "../../config/navigate";
import { message } from "antd";
// import { fetchPosts, createPost } from "./NewFeed.duck"; // logic to be implemented
// import DetailCourt from "../detailCourt/DetailCourt";

const CourtModal = (props: any) => {
  const { courtData } = props;
  if (!courtData) return null;
  const { images, name, location, description } = courtData;

  return (
    <div className={styles.courtPreview}>
      <img
        src={getImageCourt(images[0]?.url)}
        alt={name}
        className={styles.courtPreviewImg}
      />
      <div className={styles.courtPreviewInfo}>
        <h2>{name}</h2>
        <div className={css.address}>
          <Title
            mainElement={css.title}
            iconElement={css.icon}
            icon={getIcon({ nameIcon: iconsName.MAP })}
            title={text["CreateCourt.inputAddressTitle"]}
          />
          <p className={css.contentText}>{location}</p>
        </div>
        <div className={css.description}>
          <Title
            mainElement={css.title}
            iconElement={css.icon}
            icon={getIcon({ nameIcon: iconsName.DESCRIPTION })}
            title={text["CreateCourt.inputDescriptionTitle"]}
          />
          <p className={css.contentText}>{description}</p>
        </div>
      </div>
    </div>
  )
}

// PostCard component
function PostCard({ post }: { post: any }) {
  const { userData, createdAt, content, courtData } = post;
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();
  const { _id: userId } = useSelector((state: any) => state.user.user);
  const [messageApi, contextHolder] = message.useMessage();
  // Utility to check if content is more than 4 lines (approximate by char count)
  // For a more robust solution, measure rendered height, but here we use a simple heuristic
  const LINE_CHAR_LIMIT = 60; // adjust as needed for your font/width
  const MAX_LINES = 4;
  const maxChars = LINE_CHAR_LIMIT * MAX_LINES;
  const isLong = content.length > maxChars;

  const handleViewProfile = () => {
    if(!userId) {
      messageApi.error(text["NewFeed.errorLogin"]);
    } else {
      navigate(navigateToPage(pages.PERSONAL_PAGE, userData._id));
    }
  }

  const handleViewCourt = () => {
    if(!courtData) {
      messageApi.error(text["NewFeed.errorLogin"]);
    } else {
      navigate(navigateToPage(pages.DETAIL_COURT_PAGE, courtData._id));
    }
  }

  return (
    <div className={styles.postCard}>
      {contextHolder}
      {userData && <div className={styles.userInfo} >
        <img src={userData.avatar} alt="avatar" className={styles.avatar} onClick={handleViewProfile}/>
        <div onClick={handleViewProfile} style={{ cursor: "pointer" }}>
          <div style={{ fontWeight: 600, marginBottom: 5 }}>{userData.first_name} {userData.last_name}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{text["PersonalPage.role." + userData.role as keyof typeof text]}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 13, color: "#888" }}>
          {dayjs(createdAt).format("DD/MM/YYYY")}
        </div>
      </div>
      }
      <div className={expanded ? styles.content : styles.contentClamp}>
        {post.content}
      </div>
      {!expanded && isLong && (
        <button
          className={styles.postCardButton}
          onClick={() => setExpanded(true)}
        >
          {text["NewFeed.buttonExpand"]}
        </button>
      )}
      <div className={styles.courtDetailEmbed} onClick={handleViewCourt}>
        <CourtModal courtData={courtData} />
      </div>
    </div>
  );
}

export default function NewFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const { courtModal, posts, loading, hasMore, page, limit } = useSelector((state: any) => state.newFeed);
  const [content, setContent] = useState("");
  const { setCurPage }: any = useOutletContext();
  const { _id: userId } = useSelector((state: any) => state.user.user);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setCurPage(pages.NEW_FEED_PAGE);
    dispatch(fetchPosts(1, limit));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        dispatch(fetchPosts(page + 1, limit));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, limit, dispatch]);

  const [showCourtModal, setShowCourtModal] = useState(false);

  const handlePost = () => {
    if(!userId) {
      messageApi.error(text["NewFeed.errorLogin"]);
      return;
    }
    dispatch(createPost({
      content,
      courtId: courtModal?._id,
    }));
    setContent("");
  };

  const handleAttachCourt = () => {
    setShowCourtModal(true);
  };

  const handleCourtSelect = (lng: number, lat: number, id: string) => {
    dispatch(fetchSearchCourt(id))
    setShowCourtModal(false);
  };

  return (
    <main className={styles.main}>
      {contextHolder}
      <div className={styles.inner}>
        {/* Posting Area */}
        <div className={styles.postingArea}>
          <textarea
            placeholder={text["NewFeed.placeholder"]}
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ resize: "none", minHeight: 60, borderRadius: 10, padding: 10, border: "1px solid #eee" }}
          />
          <div className={styles.postingAreaButtons}>
            <ButtonIcon
              onClick={handleAttachCourt}
              mainElement={`${styles.btnSubmit} ${styles.btnSubmitAttach}`}
              icon={getIcon({ nameIcon: iconsName.ATTACH })}
              content={text["NewFeed.buttonAttach"]}
            />
            <ButtonIcon
              onClick={handlePost}
              mainElement={styles.btnSubmit}
              icon={getIcon({ nameIcon: iconsName.SEND })}
              content={text["NewFeed.buttonSubmit"]}
              isDisabled={!content || !courtModal}
            />
          </div>
          {courtModal && (
            <div className={styles.courtDetailEmbed}>
              <CourtModal courtData={courtModal} />
            </div>
          )}
        </div>
        {/* Post List */}
        <div className={styles.postList}>
          {posts.map((post: any) => (
            <PostCard key={post.id || post._id} post={post} />
          ))}
          {loading && (
            <div style={{ textAlign: "center", padding: 16, color: "#666" }}>
              {text["NewFeed.loading"]}
            </div>
          )}
          {!loading && !hasMore && (
            <div style={{ textAlign: "center", padding: 16, color: "#666" }}>
              {posts.length === 0 ? text["NewFeed.noPost"] : text["NewFeed.noMorePost"]}
            </div>
          )}
        </div>
      </div>
      {/* Modal for court search */}
      {showCourtModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.modalHeader}>
                <span>{text["NewFeed.searchCourt"]}</span>
                <button className={styles.modalClose} onClick={() => setShowCourtModal(false)}>&times;</button>
              </div>
              <SearchBox
                isTitle={false}
                isSearchOnMap={false}
                handleCourtSelect={handleCourtSelect}
              />
            </div>
          </div>
        )}
    </main>
  );
}