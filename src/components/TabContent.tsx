import React, { useState, useEffect } from "react";
import { styled } from "@storybook/theming";
import { H1, Form, TabsState, H2 } from "@storybook/components";
import { Source } from "@storybook/blocks";
import untar from "js-untar";

const TabWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: "4rem 20px",
  minHeight: "100vh",
  boxSizing: "border-box",
}));

const TabInner = styled.div({
  maxWidth: 1000,
  marginLeft: "auto",
  marginRight: "auto",
});

const Preview = styled.div({
  position: "relative",
  overflow: "hidden",
  margin: "25px 0 40px",
  borderRadius: "4px",
  background: "#FFFFFF",
  boxShadow: "rgba(0, 0, 0, 0.10) 0 1px 3px 0",
  border: "1px solid rgba(0,0,0,.1)",
  padding: "16px",
});

const PreviewInner = styled.div({
  "> *": {
    border: "8px solid transparent",
    display: "inline-block",
  },
});

interface TabContentProps {
  code: Record<string, string>;
}

export const TabContent: React.FC<TabContentProps> = ({ code }) => {
  const [versions, setVersions] = useState<{ [key: string]: any }>([
    "Loading versions...",
  ]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [files, updateFiles] = useState([]);
  const [numFilesExtracted, setNumFilesExtracted] = useState<number>(0);
  const [data, setData] = useState(null);
  const item = code.componentId ? code.componentId : "";
  const url = code.apiUrl ? code.apiUrl : "";
  const componentId = item?.includes("/") ? item.replace("/", ".") : item;

  if (!item) {
    return false;
  }

  useEffect(() => {
    if (item) {
      setSelectedVersion("");
      setVersions(["Loading versions..."]);
      fetch(`${url}component/${componentId}`).then((result) =>
        result.json().then((data) => {
          const fetchedVersions = Object.keys(data.versions) as {
            [key: string]: any;
          };
          setVersions(fetchedVersions);
          setData(data);
          handleVersionChange(fetchedVersions[0]);
        }),
      );
    }
  }, [componentId]);

  const getFiles = (ver: string) => {
    updateFiles((arr) => (arr = []));
    fetch(`${url}tarball/${componentId}/${ver}`)
      .then((res) => res.arrayBuffer())
      .then((arr) => arr)
      .then(untar)
      .then((tarBallFiles) => {
        Object.values(tarBallFiles)
          .filter(
            (file) =>
              !file.name.includes("package/dist") &&
              !file.name.includes("package.json") &&
              !file.name.includes("tsconfig.json") &&
              !file.name.includes(".d.ts") &&
              !file.name.includes("package/preview-"),
          )
          .map((file, i, arr) => {
            file.blob.text().then((text: { toString: () => any }) => {
              updateFiles((arr) => [
                ...arr,
                {
                  title: file.name.replace("package/", ""),
                  content: text.toString(),
                },
              ]);
            });
            if (i === arr.length - 1) {
              setNumFilesExtracted(arr.length - 1);
            }
          });
      });
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let ver;
    if (e.target) {
      setSelectedVersion(versions[e.target.value]);
      ver = versions[e.target.value];
    } else {
      setSelectedVersion(e as unknown as string);
      ver = e;
    }
    getFiles(ver);
  };

  const content = Object.entries(files).map(([k, v]) => {
    return (
      <div key={k} id={k} title={v.title}>
        <Source code={v.content} dark language="tsx" />
      </div>
    );
  });

  const getDeps = (type: string) => {
    const comp = data.versions[selectedVersion];
    if (!comp) return [];
    return Object.entries(data.versions[selectedVersion][type]).map(
      ([k, v]) => (
        <span key={k}>
          {k}@{v}
        </span>
      ),
    );
  };

  return (
    <TabWrapper>
      <TabInner>
        <H1 style={{ fontWeight: "bolder" }}>{item}</H1>
        <H2 style={{ fontWeight: "bold" }}>Versions</H2>
        <Preview>
          <Form.Select onChange={(e) => handleVersionChange(e)}>
            {versions.map(
              (version: {}, index: string | number | readonly string[]) => (
                <option key={version as string} value={index}>
                  {version}
                </option>
              ),
            )}
          </Form.Select>
          <Source
            code={`npm i @sj-ab/component-library.${item.replace(
              "/",
              ".",
            )}@${selectedVersion}`}
            language="sh"
            dark
          />
        </Preview>
        <H2 style={{ fontWeight: "bold" }}>Source code</H2>
        <Preview>
          {files.length > numFilesExtracted && <TabsState>{content}</TabsState>}
        </Preview>

        {selectedVersion && (
          <>
            <H2 style={{ fontWeight: "bold" }}>Dependencies</H2>
            <Preview>
              <PreviewInner>{getDeps("dependencies")}</PreviewInner>
            </Preview>
            <H2 style={{ fontWeight: "bold" }}>Dev dependencies</H2>
            <Preview>
              <PreviewInner>{getDeps("devDependencies")}</PreviewInner>
            </Preview>
            <H2 style={{ fontWeight: "bold" }}>Peer dependencies</H2>
            <Preview>
              <PreviewInner>{getDeps("peerDependencies")}</PreviewInner>
            </Preview>
          </>
        )}
      </TabInner>
    </TabWrapper>
  );
};
