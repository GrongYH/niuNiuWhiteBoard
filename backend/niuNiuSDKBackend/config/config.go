package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	AppName        string
	DbConfig       DbConfig
	Log            LogConfig
	StaticPath     PathConfig
	MsgChannelType MsgChannelType
}

type DbConfig struct {
	DriverName   string `json:"driverName"`
	Dsn          string `json:"dsn"`
	ShowSql      bool   `json:"showSql"`
	ShowExecTime bool   `json:"showExecTime"`
	MaxIdle      int    `json:"maxIdle"`
	MaxOpen      int    `json:"maxOpen"`
}

// 日志保存地址
type LogConfig struct {
	Path  string
	Level string
}

// 相关地址信息，例如静态文件地址
type PathConfig struct {
	FilePath string
}

// 消息队列类型及其消息队列相关信息
// gochannel为单机使用go默认的channel进行消息传递
// kafka是使用kafka作为消息队列，可以分布式部署
type MsgChannelType struct {
	ChannelType string
	KafkaHosts  string
	KafkaTopic  string
}

var cfg Config

func init() {
	// 设置文件名
	viper.SetConfigName("config")
	// 设置文件类型
	viper.SetConfigType("yaml")
	// 设置文件路径，可以多个viper会根据设置顺序依次查找
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}
	viper.Unmarshal(&cfg)

}
func GetConfig() Config {
	return cfg
}
