import { View, Text } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { AboutStyles, CommonStyles } from "../styles";

const About = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        AboutStyles.container,
        { backgroundColor: colors.background, flex: 1 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[AboutStyles.title, { color: colors.text }]}>
          รหัสวิชา : IN405109
        </Text>

        <Text
          style={[
            AboutStyles.title,
            { color: colors.text, fontSize: 18, marginTop: 10 },
          ]}
        >
          ชื่อวิชา : การเขียนโปรแกรมบนอุปกรณ์เคลื่อนที่แบบไฮบริด
        </Text>

        <Text
          style={[
            AboutStyles.title,
            { color: colors.text, fontSize: 18, marginTop: 20 },
          ]}
        >
          คำอธิบายรายวิชา(ไทย) :
        </Text>
        <Text
          style={[
            AboutStyles.description,
            { color: colors.textSecondary, marginTop: 10 },
          ]}
        >
          สถาปัตยกรรมฮาร์ดแวร์ คุณลักษณะและข้อจํากัดของอุปกรณ์เคลื่อนที่
          เครื่องมือและภาษาที่ใช้สําหรับพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่หลากหลายแพลตฟอร์ม
          การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่โดยใช้ภาษาหลากหลายแพลตฟอร์ม
          กระบวนการพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่หลากหลายแพลตฟอร์ม
          การใช้หน่วยความจําและส่วนเก็บบันทึกข้อมูล
          การขออนุญาตและการเข้าถึงส่วนฮาร์ดแวร์ ส่วนติดต่อกับผู้ใช้
          การสื่อสารเครือข่ายกับภายนอก การเชื่อมโยงกับระบบเครืองแม่ข่าย
          การทดสอบโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่โดยใช้ระบบคอมพิวเตอร์
          ประเด็นด้านความมั่นคง การฝึกปฏิบัติ
        </Text>
      </View>

      <View style={{ paddingBottom: 30 }}>
        <Link
          href="/(tabs)"
          style={[
            CommonStyles.button,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
        >
          <Text style={CommonStyles.buttonText}>Back to Profile</Text>
        </Link>
      </View>
    </View>
  );
};

export default About;
